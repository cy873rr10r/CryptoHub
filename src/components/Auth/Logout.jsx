import "./Logout.css";
import { FiLogOut } from 'react-icons/fi';

function Logout({ logout }) {

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="logout-btn"
    >
      <span>Log Out</span>
      <FiLogOut size={20} />
    </button>
  );
}

export default Logout;