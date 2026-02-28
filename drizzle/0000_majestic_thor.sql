CREATE TABLE "article" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "article_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"boutique_id" integer NOT NULL,
	"nom" text NOT NULL,
	"prix" integer NOT NULL,
	"devise" text NOT NULL,
	"photos" text NOT NULL,
	"photos_json" text,
	"vecteurs_json" text,
	"date_enregistrement" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "boutique" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "boutique_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"vendeur_id" integer NOT NULL,
	"nom" text NOT NULL,
	"longitude" double precision NOT NULL,
	"latitude" double precision NOT NULL,
	"zone" text NOT NULL,
	"logo" text,
	"date_enregistrement" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utilisateur" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "utilisateur_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"noms" text NOT NULL,
	"genre" boolean NOT NULL,
	"telephone" integer NOT NULL,
	"email" text,
	"mots_passe" text,
	"photo_profil" text,
	"date_inscription" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "utilisateur_telephone_unique" UNIQUE("telephone")
);
--> statement-breakpoint
CREATE TABLE "vendeur" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendeur_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"utilisateur_id" integer NOT NULL,
	"date_enregistrement" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interesser" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "interesser_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"utilisateur_id" integer NOT NULL,
	"article_id" integer NOT NULL,
	"date_enregistrement" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_boutique_id_boutique_id_fk" FOREIGN KEY ("boutique_id") REFERENCES "public"."boutique"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boutique" ADD CONSTRAINT "boutique_vendeur_id_vendeur_id_fk" FOREIGN KEY ("vendeur_id") REFERENCES "public"."vendeur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendeur" ADD CONSTRAINT "vendeur_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interesser" ADD CONSTRAINT "interesser_utilisateur_id_utilisateur_id_fk" FOREIGN KEY ("utilisateur_id") REFERENCES "public"."utilisateur"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interesser" ADD CONSTRAINT "interesser_article_id_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "interesser_user_idx" ON "interesser" USING btree ("utilisateur_id");--> statement-breakpoint
CREATE INDEX "interesser_article_idx" ON "interesser" USING btree ("article_id");