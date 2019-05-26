import React from 'react';
import Select from 'react-select';
import CanvasJSChart from '../assets/canvasjs.react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


var uri = 'wss://stocksimulator.intuhire.com';
if (uri.indexOf('?') == -1) {
  uri += '?encoding=text';
} else {
  uri += '&encoding=text';
}
class DisableCurrencyPair extends React.Component{

    constructor(props){
        super(props);
        this.state={
            dps : [{x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},{x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0}, {x: 9, y: 0}, {x: 10, y: 0}],
            xVal:11,
            yval:0,          
            currencyPairs:[],
          disableCurrencyPair:false
        }
      }


      handleChange=(selectedOption) => {
        this.setState({ selectedOption });
        this.socketCall({currencyPair:selectedOption.value.currency_name});
      }
       
      socketCall=(data)=>{
        // console.log("socket called",data)
        let ws = new WebSocket(uri);
        ws.onopen =()=> {
                        
        ws.send(JSON.stringify(data));
       };
       ws.onmessage = (evt)=> { 
        // var received_msg = evt.data;
        this.updateChart(evt.data);
        this.props.captureStockData(evt.data);
        this.setState({currentForexValue:evt.data});
        // console.log(data , received_msg);
      };
      this.setState({disableCurrencyPair:true});
      }
      
      updateChart(data){
        this.state.dps.push({x: this.state.xVal,y: parseFloat(data)});
        this.state.xVal++;
        if (this.state.dps.length >  10 ) {
            this.state.dps.shift();
        }
        // console.log("dps ",dps);
        this.chart.render();
      }


      render() {	
        const options = {
          theme: "light2",
          title :{
            text: this.state.currentForexValue
          },
          data: [{
            type: "line",
            dataPoints : this.state.dps
          }]
        }
      
        
      
      
        return (
        <div>
          <Row className="justify-content-md-center">
            <Col md={11}>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.props.currencyPairs}
              isDisabled={this.state.disableCurrencyPair}
              placeholder="Select Currency Pair"
            >
            </Select>
            </Col>
          </Row>
          
          <br/>
          <Row className="justify-content-md-center">
            <Col>
          <CanvasJSChart options = {options} 
             onRef={ref => this.chart = ref}
          />
          </Col>
          </Row>
          {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
        );
      }

}

export default DisableCurrencyPair;