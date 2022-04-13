import React from 'react';
import { Route, useHistory } from 'react-router';

import Detail from './detail';
import styles from './index.less';
import ItemList from './itemList';

const Main = () => {
  const history = useHistory();
  const { pathname } = history.location;
  const interfaceId = pathname.split('/').pop();

  return (
    <div className={styles.mainBigBox}>
      <ItemList
        getIinterface={(node) => {
          if (node) {
            history.push(`/main/mock/interface/${node.id}`);
          }
        }}
        interfaceId={interfaceId || ''}
      />
      <Route exact path={`/main/mock/interface/:interface_id`} component={Detail} />
    </div>
  );
};
export default Main;
