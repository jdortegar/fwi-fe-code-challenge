import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connectAdvanced } from 'react-redux';
import shallowEqual from 'shallowequal';
import { Table, Divider, Icon, Popconfirm, message } from 'antd';
import Flags from 'react-world-flags';

import { COUNTRIES } from '../../constants';
import UserModal from './UserModal';
import Avatar from '../Avatar/Avatar';

import {
  fetchPlayersSuccess,
  addPlayerSuccess,
  editPlayerSuccess,
  deletePlayerSuccess,
} from '../../appState/actions';

import './PlayerTable.scss';

class PlayerTable extends PureComponent {
  static propTypes = {
    players: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        country: PropTypes.oneOf(Object.keys(COUNTRIES)),
        winnings: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
    fetchPlayersSuccess: PropTypes.func.isRequired,
    addPlayerSuccess: PropTypes.func.isRequired,
    editPlayerSuccess: PropTypes.func.isRequired,
    deletePlayerSuccess: PropTypes.func.isRequired,
  };

  state = {
    loading: true,
    showUserModal: false,
    action: 'Add',
    userToEdit: {},
  };

  componentDidMount() {
    const { fetchPlayersSuccess } = this.props;
    fetch('http://localhost:3001/players', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ loading: false });
        if (data) {
          fetchPlayersSuccess(data);
          return data;
        }
        throw new Error(data.message);
      });
  }

  // Columns Set up

  columns = [
    {
      title: 'Player',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, user) => (
        <div className="Table__Player">
          <Avatar src={user.imageUrl} />
          <span className="Table__Player_Name">{name}</span>
        </div>
      ),
    },
    {
      title: 'Winnings',
      dataIndex: 'winnings',
      key: 'winnings',
      sorter: (a, b) => a.winnings - b.winnings,
      render: winnings => (
        <span>
          {winnings.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </span>
      ),
    },
    {
      title: 'Native of',
      key: 'country',
      dataIndex: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
      render: country => (
        <div className="country">
          <Avatar optionalClass="Avatar__Flag">
            <Flags code={country} />
          </Avatar>
          {country}
        </div>
      ),
    },
    {
      title: (
        <div className="Header__Custom">
          Actions
          <div className="Actions__Icon" onClick={() => this.modifyUser('Add')}>
            <Icon type="user-add" />
          </div>
        </div>
      ),
      key: 'actions',
      render: user => (
        <span>
          <span
            className="Actions__Icon"
            onClick={() => this.modifyUser('Edit', user)}
          >
            <Icon type="edit" />
          </span>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure delete this User?"
            onConfirm={() => this.handleDeleteUser(user)}
            okText="Yes"
            cancelText="No"
          >
            <span className="Actions__Icon">
              <Icon type="user-delete" />
            </span>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Custom Functions

  modifyUser = (action, user) => {
    if (action === 'Add') {
      this.setState({ action, showUserModal: true });
    } else if (action === 'Edit') {
      this.setState({
        action,
        showUserModal: true,
        userToEdit: user,
      });
    }
  };

  handleDeleteUser = user => {
    const { deletePlayerSuccess } = this.props;
    fetch(`http://localhost:3001/players/${user.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    }).then(response => {
      if (response.status === 204) {
        deletePlayerSuccess(user);
        message.success('User deleted successfully.');
        return response;
      }
      throw new Error(response.data.message);
    });
  };

  render() {
    const { players, addPlayerSuccess, editPlayerSuccess } = this.props;
    const { loading, showUserModal, action, userToEdit } = this.state;
    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={players}
          rowKey="id"
          loading={loading}
          scroll={{ y: '80vh' }}
          onHeaderRow={column => {
            return {
              onClick: e => {
                e.stopPropagation();
              }, // click header row
            };
          }}
        />
        <UserModal
          visible={showUserModal}
          action={action}
          closeModal={() => this.setState({ showUserModal: false })}
          addPlayerSuccess={addPlayerSuccess}
          editPlayerSuccess={editPlayerSuccess}
          user={userToEdit}
        />
      </div>
    );
  }
}

export default connectAdvanced(dispatch => {
  let result;
  const actions = bindActionCreators(
    {
      fetchPlayersSuccess,
      addPlayerSuccess,
      editPlayerSuccess,
      deletePlayerSuccess,
    },
    dispatch
  );

  return (state, props) => {
    const players = state.playerIds.map(id => state.players[id]);

    const nextResult = { ...props, ...actions, players };

    if (!shallowEqual(result, nextResult)) {
      result = nextResult;
    }

    return result;
  };
})(PlayerTable);
