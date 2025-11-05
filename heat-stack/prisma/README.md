# To Generate the Schema for the First Time

```
npx prisma generate
```

# To Change the Schema

First, edit schema.prisma.

Then, migrate the database by changing to this directory and type:

```
npx prisma migrate dev --name NAME
```

where NAME is your choice of migration name.

# To Generate the Database without Changing the Schema

TODO: Figure this out

```

```
