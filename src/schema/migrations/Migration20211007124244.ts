import { Migration } from "@mikro-orm/migrations"

export class Migration20211007124244 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "province" ("id" serial primary key, "countryID" int4 not null, "code" varchar(255) not null, "name" varchar(255) not null, "lt" varchar(255) null, "ln" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    )

    this.addSql(
      'alter table "province" add constraint "province_countryID_foreign" foreign key ("countryID") references "country" ("id") on update cascade on delete cascade;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "province" drop constraint "province_countryID_foreign";'
    )
    this.addSql('drop table "province";')
  }
}
