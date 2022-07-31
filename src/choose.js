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
    let isAllChoosed = true;
    for (let i = 0; i < this.props.values.length; i += 1) {
      if (!this.props.alreadyClicked.has(this.props.values[i])) {
        isAllChoosed = false;
        break;
      }
    }
    this.state = {
      choosed: isAllChoosed,
      species: props.values.reduce((map, obj) => {
        if (this.props.alreadyClicked.has(obj)) {
          map.set(obj, true);
        } else {
          map.set(obj, false);
        }
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
    this.selectedKeys = localStorage.getItem("keys") ?
          new Set(JSON.parse(localStorage.getItem("keys"))) : new Set();
    console.log(this.selectedKeys);
    this.families = new Map();
    for (let i = 0; i < localStorage.length; i += 1) {
      if (localStorage.key(i) === "keys") {
        continue;
      }
      let plant = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if (this.families.has(plant.Family)) {
        this.families.get(plant.Family).push(plant.Cultivar);
      } else {
        this.families.set(plant.Family, [plant.Cultivar]);
      }
    }
    this.families.set("ETC", []);

    for (let family of this.families.keys()) {
      if (family === "ETC") {
        continue;
      }
      if (this.families.get(family).length === 1) {
        this.families.get("ETC").push(this.families.get(family));
        this.families.delete(family);
      }
    }
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
            alreadyClicked={this.selectedKeys}
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
    uploadLocalStorage(this.selectedKeys);
  }
}

function uploadLocalStorage(set) {
  localStorage.setItem("keys", JSON.stringify(Array.from(set)));
  console.log(localStorage.getItem("keys"));
}

function prev() {
  location.href = "./index.html";
}

function next() {
  let array = JSON.parse(localStorage.getItem("keys"));
  if (array.length === 0) {
    alert("선택하세요.");
  } else {
    location.href = "./practice.html";
  }
}

ReactDOM.render(<Board />, document.getElementById("container"));
