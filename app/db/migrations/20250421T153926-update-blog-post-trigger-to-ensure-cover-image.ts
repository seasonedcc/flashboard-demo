import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await sql`
	  CREATE OR REPLACE FUNCTION ensure_published_blog_post_has_required_fields()
	  RETURNS TRIGGER AS $$
	  BEGIN
	    IF NEW.state = 'published' AND (
	      NEW.title IS NULL
	      OR NEW.content IS NULL
        OR NEW.cover_image IS NULL
	    ) THEN
	      RAISE EXCEPTION 'Please fill all fields before publishing.';
	    END IF;
	    RETURN NEW;
	  END;
	  $$ LANGUAGE plpgsql;
	`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
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
}
