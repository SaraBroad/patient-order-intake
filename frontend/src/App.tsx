import OrderIntakePage from "./pages/OrderIntakePage";

function Nav() {
  return (
    <nav className="nav">
      <span className="nav-brand">Patient Order Intake</span>
      <span className="nav-badge">Admin</span>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main>
        <OrderIntakePage />
      </main>
    </div>
  );
}
