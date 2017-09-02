# image-maker

## Description
An API to combine images or charts

## API

### `POST` `/`

#### Request Params

Property Name        | Description
---------------------|---------------
`images`             | `Image` array
`format`             | (optional) `pdf`, `png`, `jpeg` (for image creation)
`styles`             | (optional) an array of urls to css files to use for rendering
`id`                 | (optional) name to save file as
`width`              | (optional) width of the image
`height`             | (optional) height of the image
`timeout`            | (optional) defaults to 60s


##### Types of `Image`
###### `Image`
Property Name     | Description
------------------|---------------
`type`            | `image`
`src`             | url to image
`id`              | (optional) string id to use for identification (useful for css rules)
`css`             | (optional) css styles to apply to image

###### `HTML Image`
Property Name           | Description
------------------------|---------------
`type`                  | set to `html`
`html`                  | html to render
`id`                    | (optional) string id to use for identification (useful for css rules)
`css`                   | (optional) css styles to apply to image

###### `Text Image`
Property Name           | Description
------------------------|---------------
`type`                  | `text`
`content`               | text to render
`id`                    | (optional) string id to use for identification (useful for css rules)
`maxWidth`              | (optional) the maximum with of the text
`resizeMinCharCount`    | (optional) the minimum number of characters required before attempting to resize text
`timeout`               | (optional) maximum amount of time to dedicate to resizing text
`css`                   | (optional) css styles to apply to image

###### `PDF`
Property Name   | Description
----------------|---------------
`type`          | `pdf`
`src`           | url to the pdf
`id`            | (optional) string id to use for identification (useful for css rules)
`css`           | (optional) css styles to apply to image


#### Response
example request:
```json
{
  "id": "test",
  "height": 8255,
  "width": 5750,
  "styles": [
    "/latest/styles/yourstylesheet.css"
  ],
  "timeout": 60000,
  "images": [
    {
      "id": "pdf-base",
      "type": "pdf",
      "src": "https://domain.com/path/to/file.pdf",
      "width": 5750,
      "height": 8255
    },
    {
      "id": "page-title",
      "type": "html",
      "html": "<span>Hello World!</span>"
    },
    {
      "id": "main-photo",
      "type": "img",
      "src": "http://domain.com/path/to/file.png"
    }
  ]
}
```

example response:
```
// /create/image
{
    "url": "http://some-domain.com/test-dir/test.jpeg",
    "view": "http://some-domain.com/view?data=xxx"
}
```
