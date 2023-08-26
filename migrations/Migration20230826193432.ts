import { Migration } from '@mikro-orm/migrations';

export class Migration20230826193432 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `customer` (`id` varchar(36) not null, `cpf` varchar(11) not null, `name` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `customer` add unique `customer_cpf_unique`(`cpf`);');

    this.addSql('create table `partner` (`id` varchar(36) not null, `name` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `event` (`id` varchar(36) not null, `name` varchar(255) not null, `description` text null, `date` datetime not null, `is_published` tinyint(1) not null default false, `total_spots` int not null default 0, `total_spots_reserved` int not null default 0, `partner_id_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `event` add index `event_partner_id_id_index`(`partner_id_id`);');

    this.addSql('create table `event_section` (`id` varchar(36) not null, `name` varchar(255) not null, `description` text null, `is_published` tinyint(1) not null default false, `total_spots` int not null default 0, `total_spots_reserved` int not null default 0, `price` int not null default 0, `event_id_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `event_section` add index `event_section_event_id_id_index`(`event_id_id`);');

    this.addSql('create table `event_spot` (`id` varchar(36) not null, `location` varchar(255) null, `is_reserved` tinyint(1) not null default false, `is_published` tinyint(1) not null default false, `event_section_id_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `event_spot` add index `event_spot_event_section_id_id_index`(`event_section_id_id`);');

    this.addSql('create table `order` (`id` varchar(36) not null, `amount` int not null, `status` tinyint not null, `customer_id_id` varchar(36) not null, `event_spot_id_id` varchar(36) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `order` add index `order_customer_id_id_index`(`customer_id_id`);');
    this.addSql('alter table `order` add index `order_event_spot_id_id_index`(`event_spot_id_id`);');

    this.addSql('create table `spot_reservation` (`spot_id_id` varchar(36) not null, `reservation_date` datetime not null, `customer_id_id` varchar(36) not null, primary key (`spot_id_id`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `spot_reservation` add index `spot_reservation_spot_id_id_index`(`spot_id_id`);');
    this.addSql('alter table `spot_reservation` add index `spot_reservation_customer_id_id_index`(`customer_id_id`);');

    this.addSql('create table `stored_event` (`id` varchar(36) not null, `body` json not null, `type_name` varchar(255) not null, `occurred_on` datetime not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `event` add constraint `event_partner_id_id_foreign` foreign key (`partner_id_id`) references `partner` (`id`) on update cascade;');

    this.addSql('alter table `event_section` add constraint `event_section_event_id_id_foreign` foreign key (`event_id_id`) references `event` (`id`) on update cascade;');

    this.addSql('alter table `event_spot` add constraint `event_spot_event_section_id_id_foreign` foreign key (`event_section_id_id`) references `event_section` (`id`) on update cascade;');

    this.addSql('alter table `order` add constraint `order_customer_id_id_foreign` foreign key (`customer_id_id`) references `customer` (`id`) on update cascade;');
    this.addSql('alter table `order` add constraint `order_event_spot_id_id_foreign` foreign key (`event_spot_id_id`) references `event_spot` (`id`) on update cascade;');

    this.addSql('alter table `spot_reservation` add constraint `spot_reservation_spot_id_id_foreign` foreign key (`spot_id_id`) references `event_spot` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `spot_reservation` add constraint `spot_reservation_customer_id_id_foreign` foreign key (`customer_id_id`) references `customer` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `order` drop foreign key `order_customer_id_id_foreign`;');

    this.addSql('alter table `spot_reservation` drop foreign key `spot_reservation_customer_id_id_foreign`;');

    this.addSql('alter table `event` drop foreign key `event_partner_id_id_foreign`;');

    this.addSql('alter table `event_section` drop foreign key `event_section_event_id_id_foreign`;');

    this.addSql('alter table `event_spot` drop foreign key `event_spot_event_section_id_id_foreign`;');

    this.addSql('alter table `order` drop foreign key `order_event_spot_id_id_foreign`;');

    this.addSql('alter table `spot_reservation` drop foreign key `spot_reservation_spot_id_id_foreign`;');

    this.addSql('drop table if exists `customer`;');

    this.addSql('drop table if exists `partner`;');

    this.addSql('drop table if exists `event`;');

    this.addSql('drop table if exists `event_section`;');

    this.addSql('drop table if exists `event_spot`;');

    this.addSql('drop table if exists `order`;');

    this.addSql('drop table if exists `spot_reservation`;');

    this.addSql('drop table if exists `stored_event`;');
  }

}
