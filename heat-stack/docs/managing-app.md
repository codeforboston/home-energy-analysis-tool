# Managing the App

- `cd heat-stack`
- install [flyio console (flyctl aka fly)](https://fly.io/docs/flyctl/install/).
- sign in with the `fly` command.
- open new tab of terminal:
  - `fly proxy 5556:5555 --app heat-stack`
- in original tab of terminal:
  - `fly ssh console -C "npx prisma studio" -s --app heat-stack`
- in a browser without a VPN, access `http://localhost:5556`
- Prisma Studio should load.
- Locate and toggle on the side bar button:
  - <img width="300" height="150" alt="image" src="https://github.com/user-attachments/assets/31931965-a473-4934-a055-d1c83202f6d7" />
- Locate Role table in sidebar.
- <img width="1279" height="161" alt="image" src="https://github.com/user-attachments/assets/d693acab-076f-4467-a8cb-f67921eeaac1" />
- Press the User button next to the role:
- <img width="1310" height="196" alt="image" src="https://github.com/user-attachments/assets/159c798e-cc85-4af5-bf5e-e17ac4ecaed1" />
- Check off users to add to role:

  - search by email or username to narrow the users down.

- Once needed role change users are checked, press "Open in new tab":
- <img width="996" height="305" alt="image" src="https://github.com/user-attachments/assets/48534ab5-27bd-457b-83f4-d582ac7017db" />
- Press "Save 1 Change" in green
  - <img width="539" height="60" alt="image" src="https://github.com/user-attachments/assets/69bd9a8e-b57b-4962-953e-bd912b159735" />
