import { Migration } from "@mikro-orm/migrations"

export class Migration20211008035501 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "city" ("id" serial primary key, "provinceID" int4 not null, "code" varchar(255) not null, "name" varchar(255) not null, "lt" varchar(255) null, "ln" varchar(255) null, "postal" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    )

    this.addSql(
      'alter table "city" add constraint "city_provinceID_foreign" foreign key ("provinceID") references "province" ("id") on update cascade on delete cascade;'
    )
  }

  async down(): Promise<void> {
    this.addSql('alter table "city" drop constraint "city_provinceID_foreign";')
    this.addSql('drop table "city";')
  }
}
