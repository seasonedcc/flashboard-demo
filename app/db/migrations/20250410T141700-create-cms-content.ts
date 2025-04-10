import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createType('blogPostState')
		.asEnum(['draft', 'published'])
		.execute()

	await db.schema
		.createTable('blog_posts')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('slug', 'text', (col) => col.notNull().unique())
		.addColumn('title', 'text')
		.addColumn('content', 'text')
		.addColumn('state', sql`blog_post_state`, (col) =>
			col.notNull().defaultTo('draft')
		)
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await db.schema
		.createTable('site_content')
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('key', 'text', (col) => col.notNull().unique())
		.addColumn('value', 'text', (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute()

	await sql`
	  CREATE OR REPLACE FUNCTION ensure_published_blog_post_has_required_fields()
	  RETURNS TRIGGER AS $$
	  BEGIN
	    IF NEW.state = 'published' AND (
	      NEW.title IS NULL
	      OR NEW.content IS NULL
	    ) THEN
	      RAISE EXCEPTION 'Please fill all fields before publishing.';
	    END IF;
	    RETURN NEW;
	  END;
	  $$ LANGUAGE plpgsql;
	`.execute(db)

	await sql`
	  CREATE CONSTRAINT TRIGGER ensure_published_blog_post_has_required_fields_trigger
	  AFTER INSERT OR UPDATE ON blog_posts
	  FOR EACH ROW
	  EXECUTE FUNCTION ensure_published_blog_post_has_required_fields();
	`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('site_content').execute()
	await db.schema.dropTable('blog_posts').execute()
	await db.schema.dropType('blogPostState').execute()
}
