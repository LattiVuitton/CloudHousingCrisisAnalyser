import React, { Component } from 'react'
import Chart from 'react-google-charts'
const geoData = [
  ['Country', 'Popularity'],
  ['Germany', 200],
  ['United States', 300],
  ['Brazil', 400],
  ['Canada', 500],
  ['France', 600],
  ['RU', 700],
  ['South Africa',500]
]
const geocity = [
['City', 'Popularity'],
['New York', 200],
['Boston', 300],
['Miami', 400],
['Chicago', 500],
['Los Angeles', 600],
['Hanoi', 700]
]
class GeoChart extends Component {
  render() {
    return (
      <div className="container mt-5">
        <Chart
          width={'1400px'}
          height={'600px'}
          chartType="GeoChart"
          //data={geoData}
          data={geocity}
          //your map api key here
          //get one here https://developers.google.com/maps/documentation/javascript/get-api-key
          //mapsApiKey="AIzaSyCoFWdJ5TFXO6HTdhHfGWjRq6W3kgiBajU"
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
    )
  }
}
export default GeoChart