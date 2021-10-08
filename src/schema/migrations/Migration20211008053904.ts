import { Migration } from "@mikro-orm/migrations"

export class Migration20211008053904 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "districtTwo" ("id" serial primary key, "districtOneID" int4 not null, "code" varchar(255) not null, "name" varchar(255) not null, "lt" varchar(255) null, "ln" varchar(255) null, "postal" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);'
    )

    this.addSql(
      'alter table "districtTwo" add constraint "districtTwo_districtOneID_foreign" foreign key ("districtOneID") references "districtOne" ("id") on update cascade on delete cascade;'
    )
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "districtTwo" drop constraint "districtTwo_districtOneID_foreign";'
    )
    this.addSql('drop table "districtTwo";')
  }
}
