# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project. Find the one that suits you on the [deployment section of the documentation](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment.html).

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://docs.strapi.io) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

## Delete AppEngine Versions

Get number of versions:

```
gcloud app versions list | grep be-strapi | wc -l
```

Replace {NUMBER} with number of version - 10. i.e.: Number of versions is 50, then the {NUMBER} is 40. This is to maintain last 10 versions of deployment.

```
gcloud app versions delete `gcloud app versions list | grep be-strapi | sed 's/  */:/g' | cut -f 2 -d : | sort -r | tail -n {NUMBER} | tr "\n" " "`
```

## PostGIS for Postgres Cloud SQL

PostGIS is a spatial database extender for PostgreSQL object-relational database. It adds support for geographic objects allowing location queries to be run in SQL.

https://cloud.google.com/sql/docs/postgres/extensions

Installing PostgreSQL extension
```
CREATE EXTENSION [ IF NOT EXISTS ] extension_name
    [ WITH ] [ SCHEMA schema_name ]
             [ VERSION version ]
             [ CASCADE ]
Description
```

```
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_raster;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION postgis_sfcgal;
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION postgis_tiger_geocoder;
```

Upgrading
```
-- Upgrade PostGIS (includes raster)
ALTER EXTENSION postgis
 UPDATE TO "3.2.1";
-- Upgrade Topology
ALTER EXTENSION postgis_topology
 UPDATE TO "3.2.1";

-- Upgrade US Tiger Geocoder
ALTER EXTENSION postgis_tiger_geocoder
 UPDATE TO "3.2.1";
```

## ROLES

### Copying admin permissions from other role_id
```
INSERT INTO admin_permissions_role_links (permission_id, role_id)
	SELECT permission_id, 4 FROM admin_permissions_role_links
	WHERE role_id = 2
```

### Find admin permissions
```
SELECT * FROM public.admin_permissions
WHERE action like '%.read'
ORDER BY id ASC
```

### Copying admin permission for media library

SHOW

```
SELECT admin_permissions_role_links.permission_id, 
  admin_permissions_role_links.role_id, 
	admin_permissions.action, 
	admin_permissions_role_links.role_id, 
	admin_permissions.properties
FROM admin_permissions_role_links 
JOIN admin_permissions ON admin_permissions_role_links.permission_id = admin_permissions.id
WHERE admin_permissions_role_links.role_id = 2
ORDER BY admin_permissions.action;
```

COPY admin_permissions
```
INSERT INTO admin_permissions (action, subject, properties, conditions)
  SELECT admin_permissions.action, admin_permissions.subject, admin_permissions.properties, admin_permissions.conditions
  FROM admin_permissions_role_links JOIN admin_permissions ON admin_permissions_role_links.permission_id = admin_permissions.id
  WHERE admin_permissions_role_links.role_id = 1 and admin_permissions.action like 'plugin::upload.%'
  ORDER BY admin_permissions.action
```

FIND the newly added admin_permissions
```
SELECT * FROM admin_permissions
ORDER BY admin_permissions.id
```

LINK admin_permissions_role_links 
```
INSERT INTO admin_permissions_role_links (permission_id, role_id)
  SELECT id, 4 FROM admin_permissions
  WHERE admin_permissions.id >= 2467 and admin_permissions.id <= 2472
```


### Link roles by subject

Delete admin_permissions_role_links based on subject
```
DELETE FROM admin_permissions_role_links
WHERE permission_id IN (
  SELECT admin_permissions.id
    FROM admin_permissions_role_links
	JOIN admin_permissions ON admin_permissions_role_links.permission_id = admin_permissions.id
	WHERE admin_permissions.subject like 'api::story.story'
	AND admin_permissions_role_links.role_id = 5
) 
```

Add admin_permissions_role_links based on subject
```
INSERT INTO admin_permissions_role_links (permission_id, role_id)
  SELECT id, 5 FROM admin_permissions
  WHERE admin_permissions.subject like 'api::story.story'
```

```
api::coupon.coupon
api::feature-story.feature-story
api::flagged-listing.flagged-listing
api::listing-add-on.listing-add-on
api::listing.listing
api::listing-tag.listing-tag
api::marketing-notification.marketing-notification
api::order.order
api::payment-gateway.payment-gateway
api::shop.shop
api::story-request.story-request
api::story.story
api::story-tag.story-tag
api::user-kyc.user-kyc
api::user-profile.user-profile
plugin::users-permissions.user
```
