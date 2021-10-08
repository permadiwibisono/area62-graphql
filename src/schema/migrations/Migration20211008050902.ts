import { Migration } from "@mikro-orm/migrations"

export class Migration20211008050902 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "districtOne" ("id" serial primary key, "cityID" int4 not null, "code" varchar(255) not null, "name" varchar(255) not null, "lt" varchar(255) null, "ln" varchar(255) null, "postal" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    )

    this.addSql(
      'alter table "districtOne" add constraint "districtOne_cityID_foreign" foreign key ("cityID") references "city" ("id") on update cascade on delete cascade;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "districtOne" drop constraint "districtOne_cityID_foreign";'
    )
    this.addSql('drop table "districtOne";')
  }
}
