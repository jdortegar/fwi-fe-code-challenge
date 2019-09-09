import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import useForm from 'rc-form-hooks';

import { COUNTRIES } from '../../constants';

import './PlayerTable.scss';

const UserModal = ({
  visible,
  action,
  user,
  closeModal,
  addPlayerSuccess,
  editPlayerSuccess,
}) => {
  // Set state function
  const [state, setState] = useState({
    confirmLoading: false,
  });

  // Form

  const form = useForm();
  const { Option } = Select;
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateFields()
      .then(values => {
        setState({ confirmLoading: true });
        if (action === 'Add') {
          fetch('http://localhost:3001/players/', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
              name: values.name,
              country: values.country,
              winnings: values.winnings,
            }),
          })
            .then(response => {
              return response.json();
            })
            .then(data => {
              setState({ confirmLoading: false });
              if (data) {
                addPlayerSuccess(data);
                closeModal();
                message.success('New user created successfully.');
                return data;
              }
              throw new Error(data.message);
            });
        } else if (action === 'Edit') {
          fetch(`http://localhost:3001/players/${user.id}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify({
              name: values.name,
              country: values.country,
              winnings: values.winnings,
            }),
          })
            .then(response => {
              return response.json();
            })
            .then(data => {
              setState({ confirmLoading: false });
              if (data) {
                editPlayerSuccess(data);
                closeModal();
                message.success('User edited successfully.');
                return data;
              }
              throw new Error(data.message);
            });
        }
      })
      .catch(e => console.error(e.message));
  };

  return (
    <div>
      <Modal
        title={`${action} User`}
        visible={visible}
        onOk={handleSubmit}
        confirmLoading={state.confirmLoading}
        onCancel={closeModal}
      >
        <Form onSubmit={handleSubmit} layout="vertical">
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              initialValue: user.name,
              rules: [
                { required: true, message: 'Please input the user name!' },
              ],
            })(<Input placeholder="name" />)}
          </Form.Item>
          <Form.Item label="Winnings">
            {getFieldDecorator('winnings', { initialValue: user.winnings })(
              <InputNumber style={{ width: '100%' }} placeholder="Winnings" />
            )}
          </Form.Item>
          <Form.Item label="Country">
            {getFieldDecorator('country', {
              initialValue: user.country,
              rules: [
                { required: true, message: 'Please select your country!' },
              ],
            })(
              <Select placeholder="Please select a country">
                {Object.keys(COUNTRIES)
                  .sort()
                  .map(country => (
                    <Option value={country} key={country}>
                      {COUNTRIES[country]}
                    </Option>
                  ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

UserModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  action: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    country: PropTypes.string,
    winnings: PropTypes.number,
    imageUrl: PropTypes.string,
  }),
  addPlayerSuccess: PropTypes.func.isRequired,
  editPlayerSuccess: PropTypes.func.isRequired,
};

UserModal.defaultProps = {
  user: {},
};

export default UserModal;
