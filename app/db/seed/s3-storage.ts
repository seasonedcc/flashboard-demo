import type { S3Client } from '@aws-sdk/client-s3'
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import type {
	FileStorage,
	ListOptions,
	ListResult,
} from '@mjackson/file-storage'
import { type LazyContent, LazyFile } from '@mjackson/lazy-file'

/**
 * An S3 implementation of the `FileStorage` interface.
 */
class S3FileStorage implements FileStorage {
	protected s3: S3Client
	protected endpoint: string
	protected bucketName: string

	constructor(s3: S3Client, endpoint: string, bucketName: string) {
		this.s3 = s3
		this.endpoint = endpoint
		this.bucketName = bucketName
	}

	async has(key: string): Promise<boolean> {
		try {
			await this.s3.send(
				new HeadObjectCommand({ Bucket: this.bucketName, Key: key })
			)
			return true
		} catch (error) {
			if (error instanceof Error ? error.name === 'NotFound' : '') return false

			throw error
		}
	}

	async set(key: string, file: File): Promise<void> {
		const upload = new Upload({
			client: this.s3,
			params: {
				Bucket: this.bucketName,
				Key: key,
				Body: file.stream(),
				ContentType: file.type,
			},
		})
		await upload.done()
	}

	async get(key: string): Promise<LazyFile | null> {
		try {
			const head = await this.s3.send(
				new HeadObjectCommand({ Bucket: this.bucketName, Key: key })
			)

			const contentLength = Number(head.ContentLength)
			const contentType = head.ContentType || 'application/octet-stream'

			const s3 = this.s3
			const bucketName = this.bucketName

			const lazyContent: LazyContent = {
				byteLength: contentLength,
				stream: (start = 0, end: number = contentLength) => {
					const range = `bytes=${start}-${end - 1}`
					return new ReadableStream({
						async start(controller) {
							try {
								const command = new GetObjectCommand({
									Bucket: bucketName,
									Key: key,
									Range: range,
								})
								const { Body } = await s3.send(command)

								if (!Body) {
									throw new Error('Failed to retrieve a valid stream from S3')
								}

								const reader = Body.transformToWebStream().getReader()

								const read = async () => {
									const { done, value } = await reader.read()
									if (done) {
										controller.close()
									} else {
										controller.enqueue(value)
										await read()
									}
								}

								await read()
							} catch (error) {
								controller.error(error)
							}
						},
					})
				},
			}

			return new LazyFile(lazyContent, key, { type: contentType })
		} catch (error) {
			if (error instanceof Error && error.name === 'NoSuchKey') {
				return null
			}
			throw error
		}
	}

	async remove(_key: string): Promise<void> {
		throw new Error('Not implemented')
	}

	async put(_key: string, _file: File): Promise<File> {
		throw new Error('Not implemented')
	}

	async list<T extends ListOptions>(_options?: T): Promise<ListResult<T>> {
		throw new Error('Not implemented')
	}
}

export { S3FileStorage }
