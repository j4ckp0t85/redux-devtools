import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Container, Form } from '@redux-devtools/ui';
import { changeStateTreeSettings } from '../../actions';
import { CoreStoreState } from '../../reducers';
import { StateTreeSettings } from '../../reducers/stateTreeSettings';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

export class StateTree extends Component<Props> {
  render() {
    const stateTree: StateTreeSettings = this.props.theme;
    const formData = {
      sortAlphabetically: stateTree.sortAlphabetically,
      disableCollection: stateTree.disableCollection,
      enableSearchPanel: stateTree.enableSearchPanel,
    };

    return (
      <Container>
        <Form
          schema={{
            type: 'object',
            properties: {
              sortAlphabetically: {
                title: 'Sort Alphabetically',
                type: 'boolean',
              },
              disableCollection: {
                title: 'Disable collapsing of nodes',
                type: 'boolean',
              },
              enableSearchPanel: {
                title: 'Show search panel in State tab',
                type: 'boolean',
              },
            },
          }}
          formData={formData}
          noSubmit
          onChange={this.props.changeStateTreeSettings}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state: CoreStoreState) => ({
  theme: state.stateTreeSettings,
});

const actionCreators = {
  changeStateTreeSettings,
};

export default connect(mapStateToProps, actionCreators)(StateTree);
