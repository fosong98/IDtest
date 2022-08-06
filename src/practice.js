class SubQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "none"
    }
    this.submit = this.submit.bind(this);
    this.prev = this.prev.bind(this);
    this.clear = this.clear.bind(this);
    document.getElementById("prev").addEventListener("click", this.prev, false);
    document.getElementById("submit").addEventListener("click", this.submit, false);
    document.getElementById("next").addEventListener("click", this.clear, false);
    document.getElementById("deleteAll").addEventListener("click", this.clear, false);
  }

  render() {
    return (
    <div class={"problem " + this.state.response}>
      <div class="item">{this.props.item}</div>
      <div class="inputContainer">
        <input id={this.props.item} type="text" />

        <i onClick={this.clear} className="fa-solid fa-circle-xmark"></i>

      </div>
      <div class="answer">{this.props.answer}</div>
    </div>
    );
  }

  submit() {
    let input = document.getElementById(this.props.item).value.trim().toUpperCase();
    if (input === "") {
      this.setState({ response: "none" });
      document.getElementById(this.props.item).value = this.props.answer;
    } else if (input === this.props.answer.trim().toUpperCase()) {
      this.setState({ response: "correct" });
      document.getElementById(this.props.item).value = this.props.answer;
    } else {
      this.setState({ response: "wrong" });
    }
  }

  clear() {
    document.getElementById(this.props.item).value = "";
    this.setState({ response: "none" });
  }

  prev() {
    location.href = "./choose.html";
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
    let k = JSON.parse(localStorage.getItem("keys"));
    let randomIndex = Math.floor(Math.random() * k.length);
    let n = k[randomIndex];
    k.splice(randomIndex, 1);

    this.state = {
      keys : k,
      now : n
    };
    this.randomChoose = this.randomChoose.bind(this);
    document.getElementById("next").addEventListener("click", this.randomChoose, false);
  }

  render() {
    if (this.state.now === "") {
      return <div></div>;
    }
    let obj = JSON.parse(localStorage.getItem(this.state.now));
    return [
      <h1 id="title">{obj.Cultivar}</h1>,
      <div>
        <SubQuestion item="Family" answer={obj.Family} />
        <SubQuestion item="Genus" answer={obj.Genus} />
        <SubQuestion item="Species" answer={obj["Species/subsp./var./for."]} />
      </div>
    ];
  }

  randomChoose() {
    if (this.state.keys.length === 0) {
      alert("모든 문제를 풀었습니다.\n처음부터 시작합니다.");
      this.setState({
        keys : JSON.parse(localStorage.getItem("keys"))
      })
    }
    let randomIndex = Math.floor(Math.random() * this.state.keys.length);
    let cur = this.state.keys[randomIndex];
    this.state.keys.splice(randomIndex, 1);
    this.setState({
      keys : this.state.keys,
      now : cur
    });
  }
}

ReactDOM.render(<Question />, document.getElementById("container"));