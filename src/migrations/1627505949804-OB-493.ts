import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4931627505949804 implements MigrationInterface {
  name = 'OB4931627505949804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "customer_type_natural" DROP CONSTRAINT "FK_8e3311d05fda95aa7504f98dde5"`);
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_b4c6ecf6aeaa0dcd95a084c12ef"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_payments_conditions" DROP CONSTRAINT "FK_1f1fb49b97b9e8b36b8091a7548"`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_zones" DROP CONSTRAINT "FK_c1ef9c53e5b150e53e41c783e02"`);
      await queryRunner.query(`ALTER TABLE "invoices_sellers" DROP CONSTRAINT "FK_63771ccbcd5d4d5474c69a9b0f2"`);
      await queryRunner.query(`ALTER TABLE "invoices_sellers" DROP CONSTRAINT "FK_b739ac67616b1ab8a9769280a44"`);
      await queryRunner.query(`ALTER TABLE "invoices_documents" DROP CONSTRAINT "FK_84d2349cf048b4ae0c56bd86cc2"`);
      await queryRunner.query(`ALTER TABLE "invoices_documents" DROP CONSTRAINT "FK_f71591213c58db0862436aedd72"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" DROP CONSTRAINT "FK_4edf232e5922cbca25f4b1883c1"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" DROP CONSTRAINT "FK_b55758459a589b76be04dd8168c"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" DROP CONSTRAINT "FK_d4843ef5fb0acb6a1ea470236c6"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_2c1f1a5d5cc5380d24547a93c1b"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_47bf868d258c0f690f5c5fda019"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_49d94ba30d04e04624b2fe84a13"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_7027ad8630101789d93fee4985b"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_78299c9ae0f0236a353338e3c8a"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_925aa26ea12c28a6adb614445ee"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_93b9b633d25bc0dfcd6ee61dc6c"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_9a7d950ac061e3ed53a4be27e7f"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_bf4e790f1e733b7d8794a127592"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_e06b8ec2edeb18561c1fbba4b90"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_f6757552bd0776859af91c222ca"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_9e039f0f519ce59c452233bd299"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_3382887fe2a456e962c3a9c239b"`);
      await queryRunner.query(`ALTER TABLE "purchase" RENAME COLUMN "providerTypeId" TO "personTypeId"`);
      await queryRunner.query(`ALTER TABLE "invoices" RENAME COLUMN "customerTypeId" TO "personTypeId"`);
      await queryRunner.query(`ALTER TABLE "customer" RENAME COLUMN "customerTypeId" TO "personTypeId"`);
      await queryRunner.query(`ALTER TABLE "customer_type" RENAME TO "person_type"`);
      await queryRunner.query(`CREATE SEQUENCE "invoices_statuses_id_seq" OWNED BY "invoices_statuses"."id"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_statuses" ALTER COLUMN "id" SET DEFAULT nextval('invoices_statuses_id_seq')`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_statuses" ALTER COLUMN "id" DROP DEFAULT`);
      await queryRunner.query(
        `CREATE SEQUENCE "invoices_document_types_id_seq" OWNED BY "invoices_document_types"."id"`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_document_types" ALTER COLUMN "id" SET DEFAULT nextval('invoices_document_types_id_seq')`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_document_types" ALTER COLUMN "id" DROP DEFAULT`);

      await queryRunner.query(
        `ALTER TABLE "customer_type_natural" ADD CONSTRAINT "FK_8e3311d05fda95aa7504f98dde5" FOREIGN KEY ("customerTypeId") REFERENCES "person_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_680462968b86881e81aa22f99f1" FOREIGN KEY ("personTypeId") REFERENCES "person_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_payments_conditions" ADD CONSTRAINT "FK_7ae394390abd64aadb00a770d48" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_zones" ADD CONSTRAINT "FK_edd83e4b884aca68df4d0a5e96b" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_sellers" ADD CONSTRAINT "FK_f6faf65341c66d0f57a3d773b6a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_sellers" ADD CONSTRAINT "FK_28abdac85887bf38e5ec139324e" FOREIGN KEY ("invoicesZoneId") REFERENCES "invoices_zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_documents" ADD CONSTRAINT "FK_186fee439cb947602973c3e49c8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_documents" ADD CONSTRAINT "FK_b8cae5f7537702086bf9cb2f456" FOREIGN KEY ("documentTypeId") REFERENCES "invoices_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_details" ADD CONSTRAINT "FK_14432d52ac75a29a9d770859b00" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_details" ADD CONSTRAINT "FK_7c3acf8164b7c2968fe1f3f03ca" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_details" ADD CONSTRAINT "FK_2cecf17d3d03af3884cdf23e443" FOREIGN KEY ("sellingTypeId") REFERENCES "selling_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_1e60c34407bf8d83ae612cc079d" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_0b793047e7030ef060eaae8438a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_88a1f66aa50efb1d8d8469a00b2" FOREIGN KEY ("customerBranchId") REFERENCES "customer_branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_1df049f8943c6be0c1115541efb" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_c44c32683549a49b7c2a680d33a" FOREIGN KEY ("invoicesPaymentsConditionId") REFERENCES "invoices_payments_conditions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_661603b910bf469df5bc0412fe8" FOREIGN KEY ("invoicesSellerId") REFERENCES "invoices_sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_2c3eaac02ea8ae76f1b03f0d003" FOREIGN KEY ("invoicesZoneId") REFERENCES "invoices_zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_a595020add15845ff4cb1c743c8" FOREIGN KEY ("statusId") REFERENCES "invoices_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_66241adbf2b4ad026f8f1b25a28" FOREIGN KEY ("personTypeId") REFERENCES "person_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_4c3d34a05896be69d1326da27bc" FOREIGN KEY ("customerTypeNaturalId") REFERENCES "customer_type_natural"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_7c023b3514bd964ee60827f26c1" FOREIGN KEY ("documentTypeId") REFERENCES "invoices_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_8b2c3fd38269383e7e18a66a8dc" FOREIGN KEY ("accountingEntryId") REFERENCES "accounting_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_81a9304b4732590318a6b84b83a" FOREIGN KEY ("personTypeId") REFERENCES "person_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_81a9304b4732590318a6b84b83a"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_8b2c3fd38269383e7e18a66a8dc"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_7c023b3514bd964ee60827f26c1"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_4c3d34a05896be69d1326da27bc"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_66241adbf2b4ad026f8f1b25a28"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_a595020add15845ff4cb1c743c8"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_2c3eaac02ea8ae76f1b03f0d003"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_661603b910bf469df5bc0412fe8"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_c44c32683549a49b7c2a680d33a"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_1df049f8943c6be0c1115541efb"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_88a1f66aa50efb1d8d8469a00b2"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_0b793047e7030ef060eaae8438a"`);
      await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_1e60c34407bf8d83ae612cc079d"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" DROP CONSTRAINT "FK_2cecf17d3d03af3884cdf23e443"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" DROP CONSTRAINT "FK_7c3acf8164b7c2968fe1f3f03ca"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" DROP CONSTRAINT "FK_14432d52ac75a29a9d770859b00"`);
      await queryRunner.query(`ALTER TABLE "invoices_documents" DROP CONSTRAINT "FK_b8cae5f7537702086bf9cb2f456"`);
      await queryRunner.query(`ALTER TABLE "invoices_documents" DROP CONSTRAINT "FK_186fee439cb947602973c3e49c8"`);
      await queryRunner.query(`ALTER TABLE "invoices_sellers" DROP CONSTRAINT "FK_28abdac85887bf38e5ec139324e"`);
      await queryRunner.query(`ALTER TABLE "invoices_sellers" DROP CONSTRAINT "FK_f6faf65341c66d0f57a3d773b6a"`);
      await queryRunner.query(`ALTER TABLE "invoices_zones" DROP CONSTRAINT "FK_edd83e4b884aca68df4d0a5e96b"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_payments_conditions" DROP CONSTRAINT "FK_7ae394390abd64aadb00a770d48"`,
      );
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_680462968b86881e81aa22f99f1"`);
      await queryRunner.query(`ALTER TABLE "customer_type_natural" DROP CONSTRAINT "FK_8e3311d05fda95aa7504f98dde5"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_document_types" ALTER COLUMN "id" SET DEFAULT nextval('invoices_document_type_id_seq')`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_document_types" ALTER COLUMN "id" DROP DEFAULT`);
      await queryRunner.query(`DROP SEQUENCE "invoices_document_types_id_seq"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_statuses" ALTER COLUMN "id" SET DEFAULT nextval('invoices_status_id_seq')`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_statuses" ALTER COLUMN "id" DROP DEFAULT`);
      await queryRunner.query(`DROP SEQUENCE "invoices_statuses_id_seq"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_document_types" ALTER COLUMN "id" SET DEFAULT nextval('invoices_document_type_id_seq')`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_document_types" ALTER COLUMN "id" DROP DEFAULT`);
      await queryRunner.query(`DROP SEQUENCE "invoices_document_types_id_seq"`);
      await queryRunner.query(
        `ALTER TABLE "invoices_statuses" ALTER COLUMN "id" SET DEFAULT nextval('invoices_status_id_seq')`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_statuses" ALTER COLUMN "id" DROP DEFAULT`);
      await queryRunner.query(`DROP SEQUENCE "invoices_statuses_id_seq"`);
      await queryRunner.query(`ALTER TABLE "person_type" RENAME TO "customer_type"`);
      await queryRunner.query(`ALTER TABLE "customer" RENAME COLUMN "personTypeId" TO "customerTypeId"`);
      await queryRunner.query(`ALTER TABLE "invoices" RENAME COLUMN "personTypeId" TO "customerTypeId"`);
      await queryRunner.query(`ALTER TABLE "purchase" RENAME COLUMN "personTypeId" TO "providerTypeId"`);
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_3382887fe2a456e962c3a9c239b" FOREIGN KEY ("customerTypeId") REFERENCES "customer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_9e039f0f519ce59c452233bd299" FOREIGN KEY ("accountingEntryId") REFERENCES "accounting_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_f6757552bd0776859af91c222ca" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_e06b8ec2edeb18561c1fbba4b90" FOREIGN KEY ("customerTypeId") REFERENCES "customer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_bf4e790f1e733b7d8794a127592" FOREIGN KEY ("invoicesPaymentsConditionId") REFERENCES "invoices_payments_conditions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_9a7d950ac061e3ed53a4be27e7f" FOREIGN KEY ("invoicesSellerId") REFERENCES "invoices_sellers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_93b9b633d25bc0dfcd6ee61dc6c" FOREIGN KEY ("customerTypeNaturalId") REFERENCES "customer_type_natural"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_925aa26ea12c28a6adb614445ee" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_78299c9ae0f0236a353338e3c8a" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_7027ad8630101789d93fee4985b" FOREIGN KEY ("customerBranchId") REFERENCES "customer_branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_49d94ba30d04e04624b2fe84a13" FOREIGN KEY ("documentTypeId") REFERENCES "invoices_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_47bf868d258c0f690f5c5fda019" FOREIGN KEY ("invoicesZoneId") REFERENCES "invoices_zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices" ADD CONSTRAINT "FK_2c1f1a5d5cc5380d24547a93c1b" FOREIGN KEY ("statusId") REFERENCES "invoices_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_details" ADD CONSTRAINT "FK_d4843ef5fb0acb6a1ea470236c6" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_details" ADD CONSTRAINT "FK_b55758459a589b76be04dd8168c" FOREIGN KEY ("sellingTypeId") REFERENCES "selling_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_details" ADD CONSTRAINT "FK_4edf232e5922cbca25f4b1883c1" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_documents" ADD CONSTRAINT "FK_f71591213c58db0862436aedd72" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_documents" ADD CONSTRAINT "FK_84d2349cf048b4ae0c56bd86cc2" FOREIGN KEY ("documentTypeId") REFERENCES "invoices_document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_sellers" ADD CONSTRAINT "FK_b739ac67616b1ab8a9769280a44" FOREIGN KEY ("invoicesZoneId") REFERENCES "invoices_zones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_sellers" ADD CONSTRAINT "FK_63771ccbcd5d4d5474c69a9b0f2" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_zones" ADD CONSTRAINT "FK_c1ef9c53e5b150e53e41c783e02" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_payments_conditions" ADD CONSTRAINT "FK_1f1fb49b97b9e8b36b8091a7548" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_b4c6ecf6aeaa0dcd95a084c12ef" FOREIGN KEY ("providerTypeId") REFERENCES "customer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "customer_type_natural" ADD CONSTRAINT "FK_8e3311d05fda95aa7504f98dde5" FOREIGN KEY ("customerTypeId") REFERENCES "customer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
