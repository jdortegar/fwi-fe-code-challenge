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
  handleCancel,
  addPlayerSuccess,
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
              handleCancel();
              message.success('New user created successfully.');
              return data;
            }
            throw new Error(data.message);
          });
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
        onCancel={handleCancel}
      >
        <Form onSubmit={handleSubmit} layout="vertical">
          <Form.Item label="Name">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Please input the user name!' },
              ],
            })(<Input placeholder="name" />)}
          </Form.Item>
          <Form.Item label="Winnings">
            {getFieldDecorator('winnings')(
              <InputNumber style={{ width: '100%' }} placeholder="Winnings" />
            )}
          </Form.Item>
          <Form.Item label="Country">
            {getFieldDecorator('country', {
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
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.oneOf(Object.keys(COUNTRIES)),
    winnings: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }),
  addPlayerSuccess: PropTypes.func.isRequired,
};

export default UserModal;
