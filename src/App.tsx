import { ChangeEvent, useState } from 'react'
import './App.css'
import { showDialog, Result } from './component' 

const themes = [
    { name: "Blue", theme: "themeBlue" },
    { name: "Adwaita", theme: "themeAdwaita" },
    { name: "Adwaita dark", theme: "themeAdwaitaDark" },
]

const changeTheme = (theme: string) => {
    themes.forEach(n => document.body.classList.remove(n.theme))
    document.body.classList.add(theme)    
}

interface ExtendedContentProp {
    option1: boolean
    setOption1: (val: boolean)=>void
    option2: boolean
    setOption2: (val: boolean)=>void
    option3: boolean
    setOption3: (val: boolean)=>void
}

function App() {
    
    const [theme, setTheme] = useState(themes[0])

    const onThemeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const theme = themes.find(n => n.name == e.target.value)!
        changeTheme(theme.theme)
        setTheme(theme)
    }

    const showStandardDialog = async () => {
        const res = await showDialog({
            text: "Standard",
            btnOk: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const showSlideDialog = async () => {
        const res = await showDialog({
            text: "Slide",
            slide: true,
            btnOk: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const showSlideReverseDialog = async () => {
        const res = await showDialog({
            text: "Slide reverse",
            slideReverse: true,
            btnOk: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const show3ButtonsDialog = async () => {
        const res = await showDialog({
            text: "3 Buttons",
            btnYes: true,
            btnNo: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const showTextInputDialog = async () => {
        const res = await showDialog({
            text: "Text input:",
            inputText: "The text input",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true
        })
        if (res.result == Result.Cancel)                
            console.log("Dialog closed cancelled")
        console.log("Dialog closed", res)
    }

    const showRenameDialog = async () => {
        const res = await showDialog({
            text: "Rename File:",
            inputText: "Apocalypse Now.mp4",
            inputSelectRange: [0, 14],
            btnOk: true,
            btnCancel: true,
            defBtnOk: true
        })
        console.log("Dialog closed", res)
    }

    const showOkDialog = async () => {
        const res = await showDialog({
            text: "Only Ok", 
            btnOk: true
        })
        console.log("Dialog closed", res)
    }

    const showYesNoDialog = async () => {
        const res = await showDialog({
            text: "Yes and No", 
            btnYes: true,
            btnNo: true
        })
        console.log("Dialog closed", res)
    }

    const showFullScreenDialog = async () => {
        const res = await showDialog({
            text: "Fullscreen dialog",
            btnOk: true,
            fullscreen: true,
            btnCancel: true
        })
        console.log("Dialog closed", res)
    }

    const show2Dialogs = async () => {
        await showDialog({
            text: "First Dialog",
            btnOk: true
        })
        const res = await showDialog({
            text: "Second  Dialog",
            btnOk: true
        })
        console.log("Dialog closed", res)
    }

    const ExtendedContentNoColtrols = () => (
        <>
            <p>Some extended content</p>
            <p>Some other extended content</p>
        </>
    )

    const ExtendedContent = ({option1, option2, option3, setOption1, setOption2, setOption3 }: ExtendedContentProp) => {
        
        const ExtendedContent = () => {

            return (
                <>
                    <div>
                        <input type="checkbox" onChange={e => setOption1(e.currentTarget.checked)} className="wdb-focusable" name="chkbx1" defaultChecked={option1}/>
                        <label htmlFor="chkbx1">First option</label>
                    </div>
                    <div>
                        <input type="checkbox" onChange={e => setOption2(e.currentTarget.checked)} className="wdb-focusable" name="chkbx2" defaultChecked={option2}/>
                        <label htmlFor="chkbx2">2nd option</label>
                    </div>
                    <div>
                        <input type="checkbox" className="wdb-focusable" disabled name="chkbx3" />
                        <label htmlFor="chkbx3">2nd option</label>
                    </div>
                    <div>
                        <input type="checkbox" onChange={e => setOption3(e.currentTarget.checked)} className="wdb-focusable" name="chkbx4" defaultChecked={option3}/>
                        <label htmlFor="chkbx3">2nd option</label>
                    </div>
                </>
            )
        }
        return ExtendedContent
    }

    const showExtendedDialog = async () => {

        let option1 = false 
        let option2 = true 
        let option3 = false 

        const res = await showDialog({
            text: "Standard extended",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extended: ExtendedContent({
                option1, option2, option3,
                setOption1: (val: boolean) => { option1 = val }, setOption2: (val: boolean) => { option2 = val }, setOption3: (val: boolean) => { option3 = val }
            })
        })
        console.log("Dialog closed", res, option1, option2, option3)
    }

    const showExtendedInputDialog = async () => {

        let option1 = false 
        let option2 = true 
        let option3 = false 

        const res = await showDialog({
            text: "Standard extended",
            inputText: "The text input",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extended: ExtendedContent({
                option1, option2, option3,
                setOption1: (val: boolean) => { option1 = val }, setOption2: (val: boolean) => { option2 = val }, setOption3: (val: boolean) => { option3 = val }
            })
        })
        console.log("Dialog closed", res, option1, option2, option3)
    }

    const showExtendedNoControlsDialog = async () => {
        const res = await showDialog({
            text: "Standard extended no Controls",
            btnOk: true,
            btnCancel: true,
            defBtnCancel: true,
            extended: ExtendedContentNoColtrols
        })
        console.log("Dialog closed", res)
    }

    return (
        <div className="App">
            <select value={theme.name} onChange={onThemeChange}>
                {themes.map((n, i) => <option key={i}>{n.name}</option>) }
            </select>
			<h1>Dialog Box Component</h1>
			<p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                <button onClick={showStandardDialog}>Show Dialog</button> 
                <button onClick={showExtendedDialog}>Show Dialog Extended</button> 
                <button onClick={showExtendedInputDialog}>Show Dialog Input Extended</button> 
                <button onClick={showExtendedNoControlsDialog}>Show Dialog Extended no Controls</button> 
                <button onClick={showSlideDialog}>Slide Left</button> 
                <button onClick={showSlideReverseDialog}>Slide Right</button> 
                <button onClick={show3ButtonsDialog}>3 Buttons</button> 
                <button onClick={showTextInputDialog}>Text input</button> 
                <button onClick={showRenameDialog}>Rename file</button> 
                <button onClick={showOkDialog}>OK</button> 
                <button onClick={showYesNoDialog}>Ja Nein</button>
                <button onClick={showFullScreenDialog}>Fullscreen</button>
                <button onClick={show2Dialogs}>2 Dialogs</button>
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>
            <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </p>			
		</div>
	)
}

export default App
