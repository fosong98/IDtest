class Name extends React.Component {
  constructor(props) {
    super(props);
    this.clicked = this.clicked.bind(this);
  }

  render() {
      return  (<span 
                class={"speciesName"+ (this.props.isClicked ? " choosed":"")}
                onClick={this.clicked}
              >
                {this.props.name}
              </span>);
  }

  clicked() {
    this.props.onClick();
  }
}

class Family extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choosed: false,
      species: props.values.reduce((map, obj) => {
        map.set(obj, false);
        return map;
      }, new Map)
    };

    this.speciesClicked = this.speciesClicked.bind(this);
    this.familyClicked = this.familyClicked.bind(this);
  }

  render() {
    const result = [];

    const familyName = 
      <div className="familyNameContainer">
        <span className="familyNameSpan" onClick={this.familyClicked}>
          {this.props.familyName}
        </span>
        <hr class="familyNameBar" />
      </div>;

    const speciesNames = [];
    for (let i = 0; i < this.props.values.length; i += 1) {
      speciesNames.push(
        <Name 
          name={this.props.values[i]}
          onClick={()=>this.speciesClicked(this.props.values[i])}
          isClicked={this.state.species.get(this.props.values[i])}
        />
      );
    }
    
    const spNames = <div>{speciesNames}</div>
    result.push(familyName);
    result.push(spNames);
    return result;
  }

  speciesClicked(speciesName) {
    this.setState({
      choosed: false,
      species: (() => {
        this.state.species.set(speciesName, !this.state.species.get(speciesName));
        this.props.onClick(speciesName);
        return this.state.species;
      })()
    });
    console.log(this.state.species);
  }

  familyClicked() {
    this.setState({
      species: (()=>{
        const mapSingleIterator = this.state.species.keys();
        for (let single of mapSingleIterator) {
          if (this.state.choosed) {
            if (this.state.species.get(single)) {
              this.props.onClick(single);
            }
          } else {
            if (!this.state.species.get(single)) {
              this.props.onClick(single);
            }
          }
          this.state.species.set(single, !this.state.choosed);
          
        }
        
        return this.state.species;
      })()
    });
    this.setState({
      choosed: !this.state.choosed
    });
    console.log(this.state.species);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.selectedKeys = new Set();
    this.families = new Map();
    this.families.set("teststkld", ["학명은", "한글로", "나옵니다", "예쁜폰트가"]);
    this.families.set("dsafdfdfadfadfd", ["뭐가있을까요", "정말찾기어렵네요", "aa참"]);
    this.families.set("wafddfdafdfas", ["test그리고영어가"]);
    this.families.set("ttttestest", ["섞여", "tt있을수도tt", "ttt있으니", "tttttt그것도", "고려합시다ttttt", "Tttttt"]);
    console.log(this.families);  
  }

  render() {
    const result = []
    for (let family of this.families.keys()) {
      result.push(
        <div>
          <Family 
            familyName={family} 
            values={this.families.get(family)} 
            onClick={name => this.selected(name)}
          />
        </div>
      )
    }
    return result;
  }

  selected(name) {
    if (this.selectedKeys.has(name)) {
      this.selectedKeys.delete(name);
    } else {
      this.selectedKeys.add(name);
    }
    console.log(this.selectedKeys);
  }
}

ReactDOM.render(<Board />, document.getElementById("container"));
