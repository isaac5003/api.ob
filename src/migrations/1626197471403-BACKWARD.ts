import { MigrationInterface, QueryRunner } from 'typeorm';

export class BACKWARD1626197471403 implements MigrationInterface {
  name = 'BACKWARD1626197471403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `CREATE TABLE typeorm_metadata ("type" varchar(255) NOT NULL,"database" varchar(255) DEFAULT NULL,"schema" varchar(255) DEFAULT NULL,"table" varchar(255) DEFAULT NULL,"name" varchar(255) DEFAULT NULL,"value" text)`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "logger" RENAME COLUMN "userID" TO "userId"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "echarges_responses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction" character varying NOT NULL, "authorization" character varying NOT NULL, "approved" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "echargesId" uuid, CONSTRAINT "PK_07ef5b709c369b52e43a2362e16" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "echarges_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_020b51403ebe28b464358723b7b" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "echarges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerName" character varying NOT NULL, "authorization" character varying, "sequence" character varying NOT NULL, "description" character varying NOT NULL, "echargeType" character varying NOT NULL DEFAULT 'CE', "total" numeric NOT NULL, "origin" character varying NOT NULL DEFAULT '09a5c668-ab54-441e-9fb2-d24b36ae202e', "isPaid" boolean NOT NULL DEFAULT false, "paidDate" date, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" uuid, "invoiceId" uuid, "statusId" integer, "companyId" uuid, CONSTRAINT "PK_fb9bea4e147e5752354fad026cc" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "echarges_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "echargesId" uuid, "userId" uuid, CONSTRAINT "PK_b2fa58cdcd8684ca53e8d9fe829" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "purchase_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" double precision NOT NULL, "unitPrice" double precision NOT NULL, "incTax" boolean NOT NULL, "ventaPrice" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "chargeDescription" character varying NOT NULL, "purchaseId" uuid, CONSTRAINT "PK_b0988b2c3f2e1e5d95756b01389" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "purchases_document_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_70a0005c940431027ad16801c9f" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "purchases_payments_condition" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "cashPayment" boolean NOT NULL DEFAULT false, "companyId" uuid, CONSTRAINT "PK_6f3efad56c32c56fd77d28d3fb5" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "purchases_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf5ffb3adeb3a4eb480220611e5" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorization" character varying NOT NULL, "sequence" character varying NOT NULL, "providerName" character varying, "providerAddress1" character varying, "providerAddress2" character varying, "providerCountry" character varying, "providerState" character varying, "providerCity" character varying, "providerDui" character varying, "providerNit" character varying, "providerNrc" character varying, "providerGiro" character varying, "sum" double precision, "iva" double precision, "fovial" double precision, "contrans" double precision, "subtotal" double precision, "compraExentas" double precision, "compraNoSujetas" double precision, "compraTotal" double precision, "origin" uuid NOT NULL DEFAULT 'cf5e4b29-f09c-438a-8d82-2ef482a9a461', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "purchaseDate" date, "paymentConditionName" character varying, "companyId" uuid, "branchId" uuid, "providerId" uuid, "providerBranchId" uuid, "purchasePaymentsConditionId" uuid, "statusId" integer, "providerTypeId" integer, "providerTypeNaturalId" integer, "documentTypeId" integer, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "customer_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountingCatalogId" uuid, "companyId" uuid, CONSTRAINT "PK_01730cee964ab6fc0f027508792" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "service_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountingCatalogId" uuid, "companyId" uuid, CONSTRAINT "PK_bf4654c506cce9a83232815f4a5" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `CREATE TABLE "recovery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "used" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_47b2530af2d597ff1b210847140" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "printedDate"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "invoices_payments_condition" ADD "cashPayment" boolean NOT NULL DEFAULT false`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoices_document" ADD "layout" json`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" ADD "incIva" boolean NOT NULL DEFAULT false`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" ADD "incRenta" boolean NOT NULL DEFAULT false`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" ADD "accountingCatalogId" uuid`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "invoice" ADD "origin" uuid NOT NULL DEFAULT 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4'`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ADD "createEntry" boolean NOT NULL DEFAULT false`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ADD "accountingEntryId" uuid`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "accounting_entry" ADD "origin" character varying NOT NULL DEFAULT 'a98b98e6-b2d5-42a3-853d-9516f64eade8'`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_entry_detail" ADD "order" integer`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" ADD "registerType" character varying`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" ADD "accountingDebitCatalogId" uuid`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" ADD "accountingCreditCatalogId" uuid`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer" ADD "accountingCatalogId" uuid`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer_branch" ALTER COLUMN "contactInfo" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress1" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress2" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCountry" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerState" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCity" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sum" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "iva" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "subtotal" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotal" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotalText" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "invoiceDate" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentConditionName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sellerName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "zoneName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP COLUMN "settings"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" ADD "settings" character varying`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "branch" ALTER COLUMN "contactInfo" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer_branch" ALTER COLUMN "contactInfo" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress1" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress2" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCountry" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerState" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCity" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sum" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "iva" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "subtotal" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotal" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotalText" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "invoiceDate" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentConditionName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sellerName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "zoneName" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "branch" ALTER COLUMN "contactInfo" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges_responses" ADD CONSTRAINT "FK_0fbf764ffed2e10cc16a0c8437e" FOREIGN KEY ("echargesId") REFERENCES "echarges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges" ADD CONSTRAINT "FK_e632d567e20f82a69d2c1969704" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges" ADD CONSTRAINT "FK_624d8e4f128d7c0d22b3279e7e7" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges" ADD CONSTRAINT "FK_2b4123d3288e82f2691a7f59322" FOREIGN KEY ("statusId") REFERENCES "echarges_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges" ADD CONSTRAINT "FK_d14c6c75acd359fc45ee43e7dfe" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges_request" ADD CONSTRAINT "FK_2b0e1deedac3d8ecf4fa7b2dfdb" FOREIGN KEY ("echargesId") REFERENCES "echarges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "echarges_request" ADD CONSTRAINT "FK_60df21931ffba299360e4c22111" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase_detail" ADD CONSTRAINT "FK_6596b6e7b3814428ff49146cf5d" FOREIGN KEY ("purchaseId") REFERENCES "purchase"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchases_payments_condition" ADD CONSTRAINT "FK_cbd02e593c53a4a80668a4dcf53" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_8d03ca65b358577e505bf2bdf27" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_6bdd32829e1e6a8ecf42729a9ee" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_77b63089a51af12ca298e1f7c96" FOREIGN KEY ("providerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_2b87f32ea8a4c6af2612db284f2" FOREIGN KEY ("providerBranchId") REFERENCES "customer_branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_4c719d82b377929ba70fe38473c" FOREIGN KEY ("purchasePaymentsConditionId") REFERENCES "purchases_payments_condition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_8cda590ffa00d61f9c3d14e7b2e" FOREIGN KEY ("statusId") REFERENCES "purchases_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_b4c6ecf6aeaa0dcd95a084c12ef" FOREIGN KEY ("providerTypeId") REFERENCES "customer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_88d2b779059aa65efce88d13c39" FOREIGN KEY ("providerTypeNaturalId") REFERENCES "customer_type_natural"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchase" ADD CONSTRAINT "FK_33822d45563a52ad65ba732dfa4" FOREIGN KEY ("documentTypeId") REFERENCES "purchases_document_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "service" ADD CONSTRAINT "FK_e8972c66c19f02a5b09936876cc" FOREIGN KEY ("accountingCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "invoice" ADD CONSTRAINT "FK_9e039f0f519ce59c452233bd299" FOREIGN KEY ("accountingEntryId") REFERENCES "accounting_entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "accounting_setting" ADD CONSTRAINT "FK_e3364a636c50e65525a0b53ce18" FOREIGN KEY ("accountingDebitCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "accounting_setting" ADD CONSTRAINT "FK_32df14137be2f2431b89408108b" FOREIGN KEY ("accountingCreditCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "customer_setting" ADD CONSTRAINT "FK_28a7b36f7eaaec1b7175bb33820" FOREIGN KEY ("accountingCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "customer_setting" ADD CONSTRAINT "FK_6c1c3c773aaefd98775ce6c31ca" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "service_setting" ADD CONSTRAINT "FK_2c7b9cb18d4cf6fbd75c61950e8" FOREIGN KEY ("accountingCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "service_setting" ADD CONSTRAINT "FK_74a65013bda3c22d07b23d4de61" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_aebc7646cc39ef7d93ec1089213" FOREIGN KEY ("accountingCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "recovery" ADD CONSTRAINT "FK_318d006fbaa2a2aa666c3af387e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`CREATE VIEW "taxes_view" AS 
      SELECT 
        p.id AS id, p.authorization AS authorization, p.sequence AS sequence,p."providerId" AS "customerId", p."providerName" AS name, p.iva AS iva,pdt.id AS "documentTypeId", pdt.name AS "documentType", p.origin AS origin, 'purchases' AS type, p."companyId" AS company,
        p."purchaseDate" AS date, p."createdAt" AS "createdAt", p."sum" AS "sum"
      FROM purchase p 
      LEFT JOIN purchases_document_type pdt ON pdt.id = p."documentTypeId"
      LEFT JOIN company company ON company.id = p."companyId"
      UNION ALL
      SELECT 
        i.id AS id, i.authorization AS authorization, i.sequence AS sequence,i."customerId" AS "customerId", i."customerName" AS name, i.iva AS iva,idt.id AS "documentTypeId", idt.name AS "documentType", i.origin AS origin, 'invoices' AS type, i."companyId" AS company,
        i."invoiceDate" AS date,i."createdAt" AS "createdAt", i."sum" AS "sum" 
      FROM invoice i 
      LEFT JOIN invoices_document_type idt ON idt.id = i."documentTypeId"
      LEFT JOIN company company ON company.id = i."companyId"
      WHERE i."statusId" != 4 AND i."statusId" !=3
    
    `);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
        [
          'VIEW',
          'public',
          'taxes_view',
          'SELECT \n    p.id AS id, p.authorization AS authorization, p.sequence AS sequence,p."providerId" AS "customerId", p."providerName" AS name, p.iva AS iva,pdt.id AS "documentTypeId", pdt.name AS "documentType", p.origin AS origin, \'purchases\' AS type, p."companyId" AS company,\n    p."purchaseDate" AS date, p."createdAt" AS "createdAt", p."sum" AS "sum"\n  FROM purchase p \n  LEFT JOIN purchases_document_type pdt ON pdt.id = p."documentTypeId"\n  LEFT JOIN company company ON company.id = p."companyId"\n  UNION ALL\n  SELECT \n    i.id AS id, i.authorization AS authorization, i.sequence AS sequence,i."customerId" AS "customerId", i."customerName" AS name, i.iva AS iva,idt.id AS "documentTypeId", idt.name AS "documentType", i.origin AS origin, \'invoices\' AS type, i."companyId" AS company,\n    i."invoiceDate" AS date,i."createdAt" AS "createdAt", i."sum" AS "sum" \n  FROM invoice i \n  LEFT JOIN invoices_document_type idt ON idt.id = i."documentTypeId"\n  LEFT JOIN company company ON company.id = i."companyId"\n  WHERE i."statusId" != 4 AND i."statusId" !=3',
        ],
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
      await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, [
        'VIEW',
        'public',
        'taxes_view',
      ]);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP VIEW "taxes_view"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "recovery" DROP CONSTRAINT "FK_318d006fbaa2a2aa666c3af387e"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_aebc7646cc39ef7d93ec1089213"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service_setting" DROP CONSTRAINT "FK_74a65013bda3c22d07b23d4de61"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service_setting" DROP CONSTRAINT "FK_2c7b9cb18d4cf6fbd75c61950e8"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer_setting" DROP CONSTRAINT "FK_6c1c3c773aaefd98775ce6c31ca"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer_setting" DROP CONSTRAINT "FK_28a7b36f7eaaec1b7175bb33820"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP CONSTRAINT "FK_32df14137be2f2431b89408108b"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP CONSTRAINT "FK_e3364a636c50e65525a0b53ce18"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_9e039f0f519ce59c452233bd299"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_e8972c66c19f02a5b09936876cc"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_33822d45563a52ad65ba732dfa4"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_88d2b779059aa65efce88d13c39"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_b4c6ecf6aeaa0dcd95a084c12ef"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_8cda590ffa00d61f9c3d14e7b2e"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_4c719d82b377929ba70fe38473c"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_2b87f32ea8a4c6af2612db284f2"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_77b63089a51af12ca298e1f7c96"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_6bdd32829e1e6a8ecf42729a9ee"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_8d03ca65b358577e505bf2bdf27"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(
        `ALTER TABLE "purchases_payments_condition" DROP CONSTRAINT "FK_cbd02e593c53a4a80668a4dcf53"`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "purchase_detail" DROP CONSTRAINT "FK_6596b6e7b3814428ff49146cf5d"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges_request" DROP CONSTRAINT "FK_60df21931ffba299360e4c22111"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges_request" DROP CONSTRAINT "FK_2b0e1deedac3d8ecf4fa7b2dfdb"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges" DROP CONSTRAINT "FK_d14c6c75acd359fc45ee43e7dfe"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges" DROP CONSTRAINT "FK_2b4123d3288e82f2691a7f59322"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges" DROP CONSTRAINT "FK_624d8e4f128d7c0d22b3279e7e7"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges" DROP CONSTRAINT "FK_e632d567e20f82a69d2c1969704"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "echarges_responses" DROP CONSTRAINT "FK_0fbf764ffed2e10cc16a0c8437e"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "branch" ALTER COLUMN "contactInfo" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "zoneName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sellerName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentConditionName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "invoiceDate" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotalText" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotal" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "subtotal" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "iva" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sum" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCity" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerState" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCountry" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress2" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress1" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer_branch" ALTER COLUMN "contactInfo" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "branch" ALTER COLUMN "contactInfo" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP COLUMN "settings"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" ADD "settings" json`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "zoneName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sellerName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "paymentConditionName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "invoiceDate" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotalText" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "ventaTotal" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "subtotal" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "iva" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "sum" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCity" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerState" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerCountry" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress2" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerAddress1" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "customerName" SET NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer_branch" ALTER COLUMN "contactInfo" DROP NOT NULL`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "accountingCatalogId"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP COLUMN "accountingCreditCatalogId"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP COLUMN "accountingDebitCatalogId"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_setting" DROP COLUMN "registerType"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_entry_detail" DROP COLUMN "order"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "accounting_entry" DROP COLUMN "origin"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "accountingEntryId"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createEntry"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "origin"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "accountingCatalogId"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "incRenta"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "incIva"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoices_document" DROP COLUMN "layout"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoices_payments_condition" DROP COLUMN "cashPayment"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "invoice" ADD "printedDate" TIMESTAMP`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "recovery"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "service_setting"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "customer_setting"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "purchase"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "purchases_status"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "purchases_payments_condition"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "purchases_document_type"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "purchase_detail"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "echarges_request"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "echarges"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "echarges_status"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "echarges_responses"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "logger" RENAME COLUMN "userId" TO "userID"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`DROP TABLE "typeorm_metadata"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
