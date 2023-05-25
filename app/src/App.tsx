import * as pages from "./pages"
import { Store } from "tauri-plugin-store-api"
import { AnimatePresence, motion } from "framer-motion"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { library } from "@fortawesome/fontawesome-svg-core"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

export const AnimatedRoutes = () => {
    const location = useLocation()

    window.onkeydown = function (e) {
        if (e.key === "Backspace" && e.target == document.body) {
            e.preventDefault()
        }
    }

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
                    <Route
                        path="/passwords"
                        element={<pages.Passwords />}
                    ></Route>
                </Routes>
            </motion.div>
        </AnimatePresence>
    )
}

function App() {
    new Store("salts.dat").save()

    return (
        <div>
            <BrowserRouter>
                <AnimatedRoutes />
            </BrowserRouter>
        </div>
    )
}

library.add(fab, fas, far)
export default App
