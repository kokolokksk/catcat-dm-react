/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/destructuring-assignment */

const MenuItem = (prop: any | undefined) => {
  return (
    <>
      <div className="menu-item-container" onClick={prop.click}>
        <div className="menu-item-icon">{prop.menu.svg}</div>
        <span>{prop.menu.name}</span>
      </div>
    </>
  );
};
export default MenuItem;
