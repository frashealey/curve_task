# Curve Royalty Systems Take Home Exercise

- [Installation](#Installation)
- [Run](#run)
- [Tests](#tests)

For more introductory information, please see [the brief](task/Coding%20Test%20Details.docx).

## Installation

### Prerequisites

- NodeJS 20.11.0 or greater ([download](https://nodejs.org/en/download/package-manager/current))
- MongoDB Community Server (local installation) 7.0.11 or greater ([download](https://www.mongodb.com/try/download/community) and [setup guide](https://www.youtube.com/watch?v=gDOKSgqM-bQ))
- *(optional)* MongoDB Shell 2.2.9 or greater ([download](https://www.mongodb.com/try/download/shell), also see above setup guide)

### Project setup

Firstly, locate `mongod.conf`. On Windows, this is located in MongoDB's `/bin` directory (i.e. `C:/Program Files/MongoDB/Server/7.0/bin/mongod.conf`); or commonly `/etc/mongodb.conf` on Linux.

Modify this `mongod.conf` by replacing the commented out `replication` section with:

```
replication:
  replSetName: "curve_rep"
```

This effectively converts this standalone local MongoDB instance to a replica set, allowing the utilisation of transactions.

*Note: this single node replica set is not suitable for use in a production environment, and should only be used for development.*

Then, please ensure the **mongod service is restarted** (i.e. through Windows services; or with `sudo service mongod restart` on Linux) so these changes take effect.

The project can then be cloned:

```
git clone https://github.com/frashealey/curve_task.git
cd curve_task
```

Finally, install the project dependencies from `package.json`:
```
npm install
```

## Run

The script can then be ran with:
```
node src/app.js
```

Producing the following output, showing that 'Track 2' cannot be ingested:
```
> node src/app.js
┌─────────┬──────┬───────────────────────────┐
│ (index) │ Line │ Error                     │
├─────────┼──────┼───────────────────────────┤
│ 0       │ 1    │ 'Contract 2 is not found' │
└─────────┴──────┴───────────────────────────┘
```

## Tests

Unit and system tests can also be ran with:
```
npm test
```

Producing passes in the listed tests:
```
> npm test

> test
> mocha



  Excel tests
    ✔ returns false when no file
    ✔ returns false when incorrect filetype
    ✔ returns parsed data when valid filetype and format

  Ingest tests
    ✔ ingests track when no contract field
    ✔ returns error when contract field, contract does not exist
    ✔ ingests track when contract field, contract exists

  System test
┌─────────┬──────┬───────────────────────────┐
│ (index) │ Line │ Error                     │
├─────────┼──────┼───────────────────────────┤
│ 0       │ 1    │ 'Contract 2 is not found' │
└─────────┴──────┴───────────────────────────┘
    ✔ ingests Track 1 and errors Track 2


  7 passing (562ms)

```


\
All code and documentation by [Fraser Healey](https://github.com/frashealey)