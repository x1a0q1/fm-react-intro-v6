import { Component, FunctionComponent } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import Carousel from "./Carousel";
import ErrorBoundary from "./ErrorBoundary";
import ThemeContext from "./ThemeContext";
import Modal from "./Modal";
import { PetAPIResponse, Animal } from "./APIResponseTypes";

class Details extends Component<RouteComponentProps<{ id: string }>> {
  state = {
    loading: true,
    showModal: false,
    animal: "" as Animal,
    breed: "",
    city: "",
    state: "",
    description: "",
    name: "",
    images: [] as string[],
  };

  async componentDidMount() {
    const res = await fetch(
      `http://pets-v2.dev-apis.com/pets?id=${this.props.match.params.id}`
    );
    const json = (await res.json()) as PetAPIResponse;
    this.setState(
      // Lazy Brain writting lazy code :D
      Object.assign(
        {
          loading: false,
        },
        json.pets[0]
      )
    );
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  adopt = () => (window.location.href = "http://bit.ly/pet-adopt");

  render() {
    console.log(this.state);
    if (this.state.loading) {
      return <h2>Loading...</h2>;
    }
    const {
      animal,
      breed,
      city,
      state,
      description,
      name,
      images,
      showModal,
    } = this.state;

    return (
      <div className="details">
        <Carousel images={images} />
        <h1>{name}</h1>
        <h2>{`${animal} - ${breed} - ${city} - ${state}`}</h2>
        <ThemeContext.Consumer>
          {(themeHook) => (
            <button
              onClick={this.toggleModal}
              style={{ backgroundColor: themeHook[0] }}
            >
              Adopt {name}
            </button>
          )}
        </ThemeContext.Consumer>
        <p>{description}</p>
        {showModal && (
          <Modal>
            <h1>Would you like to adopt {name}?</h1>
            <div className="buttons">
              <button onClick={this.adopt}>Yes</button>
              <button onClick={this.toggleModal}>No</button>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

const DetailsWithRouter = withRouter(Details);
const DetailsWithErrorBoundary: FunctionComponent = () => {
  return (
    <ErrorBoundary>
      <DetailsWithRouter />
    </ErrorBoundary>
  );
};

export default DetailsWithErrorBoundary;