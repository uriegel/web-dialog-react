import { useState } from 'react'
import './App.css'
import WithDialog from './component'
import Content from './Content'
import { themes } from './themes'

function App() {

    const [theme, setTheme] = useState(themes[0])
    
    return (
        <div className={`App ${theme.theme}`} >
            <WithDialog>
                <Content theme={theme} onThemeChanged={setTheme} />
            </WithDialog>
        </div>
	)
}

export default App


