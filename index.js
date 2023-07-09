const legends = [
    "Bangalore", "Revenant", "Fuse", "Ash", "Maggie", "Ballistic",
    "Pathfinder", "Wraith", "Octane", "Horizon", "Valkyrie",
    "Bloodhound", "Crypto", "Seer", "Vantage",
    "Gibraltar", "Lifeline", "Mirage", "Loba", "Newcastle",
    "Caustic", "Wattson", "Rampart", "Catalyst",
]
const weapons = [
    "Havoc", "Flatline", "Hemlok", "R-301", "Nemesis",
    "Aalternator", "Prowler", "R-99", "Volt", "CAR",
    "Devotion", "L-STAR", "Spitfire", "Rampage",
    "G7", "TripleTake", "30-30", "Bocek",
    "ChargeRifle", "Longbow", "Sentinel", "Kraber",
    "EVA-8", "Mastiff", "Mozambique", "Peacekeeper",
    "RE-45", "P2020", "Wingman",
]

const playerConfigTemplate = document.querySelector("#templates template.player-config")
const resultFrameTemplate = document.querySelector("#templates template.result-frame")
const checkboxInputTemplate = document.querySelector("#templates template.checkbox-input")

const query = new URLSearchParams(window.location.search)

function initialize() {
    buildForm()
    roll()
}

function buildForm() {
    const form = document.getElementById("mainForm")

    const playerConfigs = form.querySelector("div#playerConfigs")
    for(let i = 1; i < 4; i++) {
        const current = playerConfigTemplate.content.cloneNode(true)

        const playerName = current.querySelector('input[name="name"]')
        playerName.name = `p${i}n`
        playerName.value = query.get(playerName.name)

        const legendsWrapper = current.querySelector(".legends")
        legends.forEach((legend, index) => {
            const checkbox = checkboxInputTemplate.content.cloneNode(true)

            const control = checkbox.querySelector("input")
            control.name = `p${i}l${index}`
            if(!!playerName.value) {
                control.disabled = false
                control.checked = !!query.get(control.name)
            } else {
                control.disabled = true
                control.checked = true
            }

            checkbox.querySelector(".label").innerText = legend

            legendsWrapper.appendChild(checkbox)
        })

        playerName.addEventListener('input', ev => {
            legendsWrapper.querySelectorAll("input").forEach(checkbox => {
                checkbox.disabled = !ev.target.value
            })
        })

        playerConfigs.appendChild(current)
    }

    const globalWeaponMode = query.get("gwm") || "random"
    const globalWeaponModeControl = document.querySelector(`input[name="gwm"][value="${globalWeaponMode}"]`)
    if(globalWeaponModeControl) {
        globalWeaponModeControl.checked = true
    }
}

function roll() {
    const results = document.getElementById("result")

    const pickedLegends = []
    const pickedWeapons = []

    for(let i = 1; i < 4; i++) {
        const playerName = query.get(`p${i}n`)
        if(!!playerName) {
            const current = resultFrameTemplate.content.cloneNode(true)

            current.querySelector(".name").innerText = playerName

            const legendPool = legends.filter((legend, index) => pickedLegends.indexOf(legend) < 0 && !!query.get(`p${i}l${index}`))
            const legendPick = legendPool[Math.floor(Math.random() * legendPool.length)]
            current.querySelector(".legend").innerText = legendPick
            pickedLegends.push(legendPick)

            const weaponMode = query.get("gwm") || "random"

            const weaponPool1 = weapons.filter(weapon => weaponMode === "random" || weaponMode === "player" || pickedWeapons.indexOf(weapon) < 0)
            const weaponPick1 = weaponPool1[Math.floor(Math.random() * weaponPool1.length)]
            current.querySelector(".weapon1").innerText = weaponPick1
            pickedWeapons.push(weaponPick1)

            const weaponPool2 = weapons.filter(weapon => weaponMode === "random" || (weaponMode === "global" && pickedWeapons.indexOf(weapon) < 0) || (weaponMode === "player" && weapon !== weaponPick1))
            const weaponPick2 = weaponPool2[Math.floor(Math.random() * weaponPool2.length)]
            current.querySelector(".weapon2").innerText = weaponPick2
            pickedWeapons.push(weaponPick2)

            results.appendChild(current)
        }
    }
}

addEventListener("DOMContentLoaded", initialize)
