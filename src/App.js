import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DisableCurrencyPair from './graphComponent/currencyPairGraph';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

class App extends React.Component {

constructor(props){
  super(props);
  this.state={
    currencyPairs:[],
    disableCurrencyPair:false,
    dataA:undefined,
    dataB:undefined,
    dataC:undefined,
    PIPValue:undefined
  }
}




componentDidMount=()=>{
  fetch('https://restsimulator.intuhire.com/currency_pairs')
		.then(function(response) {
			return response.json();
		})
		.then(data=>
      this.setState({currencyPairs:data})
		);
 
}

captureStockDataFromA=(data)=>{
  this.setState({dataA:data});
  this.buySellLogic();
}

captureStockDataFromB=(data)=>{
  this.setState({dataB:data});
  this.buySellLogic();
}

captureStockDataFromC=(data)=>{
  this.setState({dataC:data});
  this.buySellLogic();
}

buySellLogic=()=>{
  //  console.log((this.state.dataA/this.state.dataB)-this.state.dataC );
  if((this.state.dataA/this.state.dataB)-this.state.dataC < -this.state.PIPValue)
  return "buy";
  else if((this.state.dataA/this.state.dataB)-this.state.dataC > this.state.PIPValue)
  return "sell";
  else if(((this.state.dataA/this.state.dataB)-this.state.dataC > -this.state.PIPValue) && ((this.state.dataA/this.state.dataB)-this.state.dataC < this.state.PIPValue))
  return "hold";
}

handlePIP=(evt)=>{
  this.setState({PIPValue:evt.target.value})
}

render(){
  let currencyOptions = this.state.currencyPairs.map((currencyPair)=> {
    return { value: currencyPair, label: currencyPair.currency_name };
  })

return (
      <div>
        <Container>
          <Row className="justify-content-md-center"><h3>Forex Trade App</h3></Row>
          <Row className="justify-content-md-center">
            <Col md={9}>
            <br/>
            <InputGroup size="md">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-md">Enter PIP </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl aria-label="Enter PIP " aria-describedby="inputGroup-sizing-sm" onChange={this.handlePIP}/>
              </InputGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
            <DisableCurrencyPair  currencyPairs={currencyOptions} captureStockData={this.captureStockDataFromA}/>
            </Col>
            <Col>
            <DisableCurrencyPair  currencyPairs={currencyOptions} captureStockData={this.captureStockDataFromB}/>
            </Col>
            <Col>
            <DisableCurrencyPair  currencyPairs={currencyOptions} captureStockData={this.captureStockDataFromC}/>
            </Col>
        </Row>
        {
        this.state.dataA != undefined && this.state.dataB != undefined && this.state.dataC != undefined && this.state.PIPValue != undefined && this.state.PIPValue != "" &&
        <Row className="justify-content-md-center">
            <Col md={2}>
                {this.buySellLogic() =="buy" &&  <Button variant="success">Buy</Button>}
                {this.buySellLogic() =="sell" &&  <Button variant="danger">Sell</Button>}
                {this.buySellLogic() =="hold" &&  <Button variant="light">Hold</Button>}
                
            </Col>
        </Row>
      }
        </Container>
      </div>
    )
	
  }
}

export default App;
