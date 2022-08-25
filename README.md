# Calypsocloud multi services public backend

## Description

This is a backend for the [Calypsocloud](https://calypsocloud.com) multi services platform.

## Requirements

- [Calypsocloud](https://calypsocloud.com)
- [Calypsocloud multi services](https://calypsocloud.com/docs/multi-services)
- [Calypsocloud multi services public](https://calypsocloud.com/docs/multi-services-public)

## Installation

Generate env file:

```bash
node ./scripts/genEnv
```

Generate sqlite database:

```bash
npx prisma migrate dev --schema prisma/schema3.prisma --name init
```

Install dependencies:

```bash
yarn install
```

Run server:

```bash
yarn start
```

### Docker

Build image:

```bash
docker build -t multi-backend .
```

Run container:

```bash
docker run -d -p 6565:6565 multi-backend
```

## Usage

### Echo service

```bash

curl -X POST -d '{"message": "Hello world"}' http://localhost:6565/v1/echo

```

### Post data to DB (SQLite)

```bash

curl -X POST -d '{"title": "Hello world", "body":"hey there"}' http://localhost:6565/v1/send

```

### Get data from DB (SQLite)

```bash

curl http://localhost:6565/v1/list

```

### Post log

```bash

curl -X POST -d '{"app": "App name", "message":"Infuriating debug messages"}' http://localhost:6565/v1/log

```

Logs will be saved in `logs/<your app name>.log`

### Read log entries

```bash

curl http://localhost:6565/v1/log?app=<your app name when you logged>

```

### Clear logs

```bash

curl http://localhost:6565/v1/clearlogs

```

## License

The MIT License (MIT)

Copyright (c) 2022 c4lyp5o

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Authors

- [c4lyp5o](https://github.com/c4lyp5o)

## Contributors

- Coming Soon

## Changelog

- 2022-08-20: Initial code done

## TODO

- [ ] Add tests
- [ ] Add documentation
- [ ] Add examples
- [ ] Add license
- [ ] Add contributors
- [ ] Add changelog
- [ ] Add TODO

## Contributing

Contributors are welcome!

    * Fork the repository
    * Create a new branch
    * Make your changes
    * Commit your changes
    * Push your branch to GitHub
    * Open a pull request
