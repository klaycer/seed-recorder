import React, { Fragment, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { ModalContext } from '../Contexts/ModalProvider';
import Routes from '../Components/Routes';
import ErrorLog from './Utils/ErrorLog';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

const Modal = () => {
  const [maxWidth, setMaxWidth] = useState(Number.MAX_SAFE_INTEGER)
  const [maxHeight, setMaxHeight] = useState(Number.MAX_SAFE_INTEGER)

  useEffect(() => {
    setMaxWidth(document.body.clientWidth-5)
    setMaxHeight(document.body.clientHeight-5)
    window.addEventListener("resize", function(event) {
      setMaxWidth(document.body.clientWidth-5)
      setMaxHeight(document.body.clientHeight-5)
    });
  }, []);

  const style = (hideView) => ({
    display: hideView ? "none" : "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <ModalContext.Consumer>
      {({ windowPosition, hasDraggedWindowPosition, extensionId, getExtensionId, disableDrag, hideView }) => (
        <ErrorLog>
          <Rnd
            style={style(hideView)}
            default={{
              x: windowPosition.x,
              y: windowPosition.y,
              width: 480,
              height: 480
            }}
            className="border-solid border-4 border-indigo-400"
            disableDragging={disableDrag}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
          >
            <div className="text-gray-400 bg-gray-900 w-full h-full overflow-scroll">
              <Router>
                <Switch>
                  {Routes.map(r => {
                    return (
                      <Fragment key={r.path}>
                        <Route exact path={r.path}>
                          {r.component()}
                        </Route>
                        {Array.isArray(r.childRoutes) && r.childRoutes.map(cr => {
                          return (
                            <Route key={cr.path} path={cr.path}>
                              {cr.component()}
                            </Route>
                          )
                        })}
                      </Fragment>
                    )
                  })}
                </Switch>
              </Router>
            </div>
          </Rnd>
        </ErrorLog>
      )}
    </ModalContext.Consumer>
  );
};

export default Modal;
