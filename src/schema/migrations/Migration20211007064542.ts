import { Migration } from "@mikro-orm/migrations"

export class Migration20211007064542 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "country" ("id" serial primary key, "code" varchar(255) not null, "iso3" varchar(255) null, "name" varchar(255) not null, "phoneCode" varchar(255) not null, "capital" varchar(255) not null, "currency" varchar(255) not null, "emoji" varchar(255) null, "emojiU" varchar(255) null, "lt" varchar(255) null, "ln" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table "country";')
  }
}
