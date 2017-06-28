# image-maker

## Description
An API to combine images or charts

## API

### `POST` `/`

#### Response
example:
```
{
    "imgUrl": "http://some-domain.com/image.png",
    "viewUrl": "http://some-domain/image/NNN/view" // loads a webpage view of the result
}
```

##### Request Params

Name        | Description
------------|---------------
`format`         | `png`, `jpg`
`images`      | `Image` array


###### `Image`
Name     | Description
---------|---------------
`css`    | css styles to apply to image
`src`    | url to image

###### `HTML Image`
Name           | Description
---------------|---------------
`format`       | `html`
`css`          | css styles to apply to image
`html`         | html to render

###### `Chart Image`
Name           | Description
---------------|---------------
`format`       | [`donut`](http://www.reactd3.org/docs/basic/#donut), [`bar`](http://www.reactd3.org/docs/basic/#bar)
`css`          | css styles to apply to image
...            | params as specified by [chart.js](http://www.chartjs.org/docs/latest/)

