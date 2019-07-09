import React, { useEffect } from 'react';
import cx from 'classnames';

import request from '@api/request';
import Notice from '@store/notice/index';
import Agents from '@store/agents/index';
import Button from '@components/Button';

import { AgentItemProps } from '../types';

import './index.scss';

const NewResource = (props: AgentItemProps) => {
  const inputElement = React.useRef<HTMLInputElement>(null);
  const { state: notice, dispatch: noticeDispatch } = React.useContext(Notice.Context);
  const { dispatch: agentsDispatch } = React.useContext(Agents.Context);
  const [resource, setResource] = React.useState('');

  useEffect(() => {
    if (inputElement && inputElement.current) {
      inputElement.current.focus();
    }
  });

  if (notice.newResourceAgentId !== props.data.id) {
    return null;
  }

  const handleClose = () => {
    noticeDispatch({
      type: 'CLOSE_RESOURCE'
    });
    setResource('');
  };
  const handleChangeResource = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResource(e.target.value);
  };
  const handleAddResources = () => {
    if (resource) {
      const newResource = resource.split(/,|，/);
      const newItem = {
        ...props.data,
        resources: [
          ...props.data.resources,
          ...newResource
        ]
      };
      request({
        noticeDispatch,
        apiPath: 'agents/modify',
        callBack: () => {
          agentsDispatch({
            type: 'ADD_RESOURCES',
            payload: {
              id: props.data.id,
              data: newResource
            }
          });
          setResource('');
        }
      }, newItem);
    }
    handleClose();
  };

  return (
    <div onBlur={handleClose} className={cx('newResource', props.className)}>
      <i className="newResource-arrow" />
      <i onClick={handleClose} className="newResource-icon icon-close" />
      <p className="newResource-title">Separate multiple resource name with commas</p>
      <input
        ref={inputElement}
        value={resource}
        onChange={handleChangeResource}
        className="newResource-input"
        type="text"
        placeholder="Input value"
      />
      <div className="newResource-button">
        <Button onClick={handleAddResources}>Add Resources</Button>
        <Button gray onClick={handleClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default NewResource;