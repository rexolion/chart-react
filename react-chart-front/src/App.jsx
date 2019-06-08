import React from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';

const mockData = {
  labels: ['hey','yey','yay'],
  datasets: [
    {
      label: 'Number of colors',
      data: [1,2,3],
      backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
    }
  ]}

  const chartOptions = {
    legend: {
      display: false
    }
  }

  const dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      dataArr: [],
      labels: [],
      data: [],
      chartData: null
     }
  }

  
  componentDidMount() {
    axios.get('http://localhost:4000/')
    .then(res => {
      const data = res.data.map(val => val.amount);
      const labels = res.data.map(val => val.name);

      this.setState({dataArr: res.data, data, labels});
    })
    .catch(err => {
      console.log(err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.chartData) {
      const { data, labels } = this.state;
      const colors = data.map(() => dynamicColors())
      const chartData = this.getChartData(labels, data,colors);
      this.setState({chartData});
    }
  }

  getChartData(labels,data,colors) {
    const chartData = {
      labels,
      datasets: [
        {
          label: 'Number of colors',
          data: data,
          backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
        }
      ]}

    return chartData;
  }

  render() { 
    const { chartData } = this.state;

    return ( 
      <div className="App">
        <Doughnut options={chartOptions} data={chartData || mockData} width='600' height='300'/>
      </div>
     );
  }
}

export default App;
