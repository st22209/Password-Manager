import * as pages from "./pages";
import { Store } from "tauri-plugin-store-api";
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

export const AnimatedRoutes = () => {
	const location = useLocation();
	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<pages.NewUser />}></Route>
					<Route path="/login" element={<pages.Login />}></Route>
					<Route path="/signup" element={<pages.Signup />}></Route>
				</Routes>
			</motion.div>
		</AnimatePresence>
	);
};

function App() {
	new Store("salts.dat").save();

	return (
		<div>
			<BrowserRouter>
				<AnimatedRoutes />
			</BrowserRouter>
		</div>
	);
}

export default App;
