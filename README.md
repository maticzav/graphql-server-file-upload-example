# GraphQL Server File Upload Example

This example illustrates the implementation of File API with GraphQL Gateway pattern. The best example for GraphQL Gateway basic usage can be found here: https://github.com/graphcool/graphql-server-example .

## Getting Started

### Initializing the Graphcool Database Service
```sh
graphcool deploy # copy API endpoint into the `GRAPHCOOL_ENPOINT` env var in .env
graphcool root-token apikey # put the root token into the `GRAPHCOOL_SECRET` env var in .env
```

To get `GRAPHCOOL_SECRET` visit http://jwtbuilder.jamiekurtz.com and scroll to the bottom where you can hash your secret from `graphcool.yml` and get the hashed output. (_sssh_ is used in the example.)

### Setting up the S3 bucket
1. Head over to the [AWS console](http://console.aws.amazon.com/) and navigate to the `S3` section.
2. Click create bucket and follow the instructions on screen.
3. Once you have created a `bucket`, add bucket name that you've picked to .env `S3_BUCKET` property.
4. Head back to the AWS and open `Identity and Access Management (IAM)` [console](https://console.aws.amazon.com/iam). Navigate to `Users` and click `Add user`.
5. Under _Access type_ check **Programmatic access** and press `Next`. From options, select _Attach existing policies directly_ and a table below will open. Search for **AmazonS3FullAccess** and check it. Press `Next` to review everything and submit by pressing `Create user`.
6. Once done, copy the _Access key ID_ to .env `S3_KEY` property and _Secret access key_ to .env `S3_SECRET` property.
7. You are all set to start the server!

### Starting the Server

```sh
yarn install
yarn start
# Open http://localhost:5000/
```

## Uploading files

You can upload files  to a project by doing a `multipart/form-data` HTTP request to the File API `http://localhost:5000/upload`.

It's important to use the form parameter `data` as seen in the examples below.

### Uploading workflow

Everytime you upload a file to Graphcool, a new `File` node is created that contains information about that file:

* `id`: the [familiar system field](!alias-eiroozae8u#id-field)
* `secret`: a unique, unguessable secret that allows access to the file
* `name`: the file name
* `size`: the file size
* `url`: the url of the file where it can be accessed. The url contains of the project id and the file `secret`, so is unguessable as well.
* `contentType`: the contentType of the file. It is determined based on the file name.

If you want to connect the `File` node to another node in a relation, you can use the `id` in the response.

With`curl` you could execute:

`curl -X POST 'http://localhost:5000/upload' -F "data=@example.png`

This updates the local file `example.png`. The response could look something like this:

```JSON
{
  "secret": "__SECRET__",
  "name": "myname.png",
  "size": "___SIZE___",
  "url": "___URL___",
  "id": "___ID___",
  "contentType": "image/png"
}
```

## Project structure

### Directories

* `database`: GraphQL database service definitions (using Graphcool)
* `src`: Source code of the gateway

### Files

* `.env`: Contains env vars (such as `GRAPHCOOL_ENPOINT` and `GRAPHCOOL_APIKEY`)
* `.graphqlconfig`: [GraphQL config](https://github.com/graphcool/graphql-config) file used for IDE support and [`graphql-cli`](https://github.com/graphcool/graphql-cli)
* `tsconfig.json`: Typescript compiler settings

## License
MIT
