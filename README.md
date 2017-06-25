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
background  | An `Image`. Serves as the root element for all images
images      | `Image` array


###### `Image`
Name   | Description
-------|---------------
src    | url to image
css    | css styles to apply to image


###### `Chart Image`
Name           | Description
---------------|---------------
format         | [`donut`](http://www.reactd3.org/docs/basic/#donut), [`bar`](http://www.reactd3.org/docs/basic/#bar)
css            | css styles to apply to image
chartParams    | data to be used for chart as defined by [react-d3](http://www.reactd3.org/docs/basic/)
labelKey       | key name of label in chartData.data
valueKey       | key name of value in chartData.data

