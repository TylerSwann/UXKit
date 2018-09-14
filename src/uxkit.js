

window.addEventListener("load", () => {
    setTimeout(() => {
        UXKit().init();
    }, 5);
});

function UXKit()
{
    function _addAlertListeners()
    {
        let alerts = document.getElementsByClassName("ux-alert");
        for (let i = 0; i < alerts.length; i++)
        {
            let alertBox = alerts[i];
            alertBox.querySelector(".close-button").addEventListener("click", () => {
                alertBox.style.transform = "translateY(-200%)";
                alertBox.style.opacity = "0";
            });
        }
    }
    function _addRippleListeners()
    {
        let ripples = document.getElementsByClassName("rippled");
        for (let i = 0; i < ripples.length; i++)
        {
            addRippleEffect(ripples[i]);
        }
    }
    function _addTooltipListeners()
    {
        let tooltips = document.getElementsByClassName("ux-tip");
        for (let i = 0; i < tooltips.length; i++)
        {
            let tooltip = tooltips[i];
            if (!tooltip.hasAttribute("tooltip"))
                continue;
            let text = tooltip.getAttribute("tooltip");
            addTooltip(tooltip, text);
        }
    }
    function _addControlListeners()
    {
        let sliders = document.getElementsByClassName("ux-slider");
        for (let i = 0; i < sliders.length; i++)
        {
            let slider = sliders[i];
            let isShowing = false;
            let indicator = slider.querySelector("div");
            let valueNode = indicator.querySelector("span");
            let sliderInput = slider.querySelector("input");
            slider.addEventListener("mousedown", e => {
                isShowing = true;
                let size = indicator.offsetWidth;
                let pos = slider.getBoundingClientRect();
                let x = e.clientX - pos.left - (size / 2.0);
                indicator.style.left = x + "px";
                valueNode.innerText = sliderInput.value;
                setTimeout(() => {
                    indicator.style.transform = "scale(1) rotate(45deg)";
                }, 100);
            });
            slider.addEventListener("mousemove", e => {
                if (!isShowing)
                    return;
                valueNode.innerText = sliderInput.value;
                let size = indicator.offsetWidth;
                let pos = slider.getBoundingClientRect();
                let x = e.clientX - pos.left - (size / 2.0);
                indicator.style.left = x + "px";
            });
            slider.addEventListener("mouseup", e => {
                isShowing = false;
                setTimeout(() => {
                    indicator.style.transform = "scale(0) rotate(45deg)";
                }, 100);
            });
        }
        let switches = document.getElementsByClassName("ux-switch");
        for (let i = 0; i < switches.length; i++)
        {
            let swtch = switches[i];
            swtch.addEventListener("click", () => {
                if (swtch.classList.contains("checked"))
                    swtch.classList.remove("checked");
                else
                    swtch.classList.add("checked");
            });
        }

        let selectMenus = document.getElementsByClassName("ux-select");
        window.addEventListener("click", (e) => {
            setTimeout(() => {
                let popups = document.getElementsByClassName("ux-select-menu");
                function close(popupMenu)
                {
                    if (!popupMenu.classList.contains("transitioning-popup"))
                    {
                        popupMenu.style.opacity = "0";
                        popupMenu.style.transform = "scale(0)";
                    }
                }
                for (let i = 0 ; i < popups.length; i++)
                {
                    if (e.srcElement.classList.contains("ux-menu-item"))
                        setTimeout(() => { close(popups[i]); }, 300);
                    else
                        setTimeout(() => { close(popups[i]); }, 9);
                }
            }, 20);
        });
        for (let i = 0 ; i < selectMenus.length; i++)
        {
            let menu = selectMenus[i];
            let defaultMenu = menu.querySelector("select");
            let optionNodes = defaultMenu.querySelectorAll("option");
            let popupMenu = document.createElement("div");
            popupMenu.className = "ux-select-menu";

            for (let i = 0; i < optionNodes.length; i++)
            {
                let option = optionNodes[i].innerText;
                let optionNode = document.createElement("span");
                optionNode.className = "ux-menu-item rippled";
                optionNode.innerText = option;
                optionNode.onclick = () => {
                    defaultMenu.value = optionNode.textContent;
                };
                addRippleEffect(optionNode);
                popupMenu.appendChild(optionNode);
            }
            defaultMenu.addEventListener("mousedown", e => {
                e.preventDefault();
                let x = (menu.getBoundingClientRect().left + window.scrollX);
                let y = (menu.getBoundingClientRect().top + window.scrollY + menu.getBoundingClientRect().height);
                popupMenu.style.top = y + "px";
                popupMenu.style.left = x + "px";
                popupMenu.classList.add("transitioning-popup");
                setTimeout(() => {
                    popupMenu.style.opacity = "1";
                    popupMenu.style.transform = "scale(1)";
                    setTimeout(() => {
                        popupMenu.classList.remove("transitioning-popup");
                    }, 100);
                }, 10);
                if (popupMenu.parentElement == null)
                    document.documentElement.appendChild(popupMenu);
            });
        }

        let checkBoxes = document.getElementsByClassName("ux-check-box");
        for (let i = 0; i < checkBoxes.length; i++)
        {
            let checkbox = checkBoxes[i];
            let input = checkbox.querySelector("input[type='checkbox']");
            if (input.checked)
                checkbox.classList.add("checked");
            checkbox.addEventListener("click", () => {
                if (checkbox.classList.contains("disabled"))
                    return;
                if (input.checked)
                {
                    checkbox.classList.remove("checked");
                    input.checked = false;
                }
                else
                {
                    checkbox.classList.add("checked");
                    input.checked = true;
                }
            });
        }

        let textfields = document.getElementsByClassName("ux-text-field");
        for (let i = 0; i < textfields.length; i++)
        {
            let textfield = textfields[i];
            let input = textfield.querySelector("input");
            textfield.addEventListener("change", () => {
                if (input.value != null && input.value !== "")
                    textfield.classList.add("valid");
                else if (textfield.classList.contains("valid"))
                    textfield.classList.remove("valid");
            });
        }

        let uploaders = document.getElementsByClassName("ux-uploader");
        for (let i = 0; i < uploaders.length; i++)
        {
            let uploader = uploaders[i];
            uploader.onclick = () => {
                setTimeout(() => {
                    uploader.querySelector("input[type='file']").click();
                }, 300);
            };
        }
    }

    function _addDialogListeners()
    {
        let dialogs = document.getElementsByClassName("dialog");
        let overlay = document.createElement("div");
        overlay.className = "overlay";
        for (let i = 0; i < dialogs.length; i++)
        {
            let dialog = dialogs[i];
            if (!dialog.hasAttribute("trigger"))
                continue;
            let trigger = document.getElementById(dialog.getAttribute("trigger"));
            if (trigger == null)
                continue;
            trigger.addEventListener("click", () => {
                showDialog(dialog, overlay);
            });
        }
    }

    function _addPopupListeners()
    {
        let popups = document.getElementsByClassName("ux-popup-box");
        window.addEventListener("mousedown", (e) => {
            for (let i = 0; i < popups.length; i++)
            {
                let popup = popups[i];
                if (e.srcElement.id !== popup.getAttribute("trigger"))
                {
                    popup.close();
                }
            }
        });
        for (let i = 0; i < popups.length; i++)
        {
            let popup = popups[i];
            if (!popup.hasAttribute("trigger"))
                continue;
            let trigger = document.getElementById(popup.getAttribute("trigger"));
            popup.close = function(){
                popup.style.transform = "scale(0)";
                popup.style.opacity = "0";
            };
            popup.style.display = "unset";
            let popupWidth = popup.getBoundingClientRect().width;
            let popupHeight = popup.getBoundingClientRect().height;
            popup.style.display = "none";
            popup.close();
            setTimeout(() => {
                popup.style.display = "unset";
            }, 200);
            let eventType = popup.classList.contains("hover") ? "mouseover" : "click";
            trigger.addEventListener(eventType, () => {
                let triggerRect = trigger.getBoundingClientRect();
                let x = triggerRect.left;
                let y = triggerRect.top;
                x += window.scrollX;
                y += window.scrollY;
                let offset = 11.0;
                if (popup.classList.contains("top"))
                {
                    x -= ((popupWidth / 2.0) - (triggerRect.width / 2.0));
                    y -= popupHeight + offset;
                }
                else if (popup.classList.contains("bottom"))
                {
                    x -= ((popupWidth / 2.0) - (triggerRect.width / 2.0));
                    y += triggerRect.height + offset;
                }
                else if (popup.classList.contains("left"))
                {
                    x -= popupWidth + offset;
                    y -= offset;
                }
                else if (popup.classList.contains("right"))
                {
                    x += triggerRect.width + offset;
                    y -= offset;
                }
                popup.style.top = y + "px";
                popup.style.left = x + "px";
                popup.style.transform = "scale(1)";
                popup.style.opacity = "1";
            });
            if (popup.classList.contains("hover") )
            {
                trigger.addEventListener("mouseout", () => {
                    for (let i = 0; i < popups.length; i++)
                    {
                        popups[i].close();
                    }
                });
            }
        }
    }


    function _addCircularProgressListeners()
    {
        let circularProgresses = document.getElementsByClassName("ux-circular-progress");
        for (let i = 0; i < circularProgresses.length; i++)
        {
            let circularProgress = circularProgresses[i];
            let fill = circularProgress.querySelector(".circle-fill");
            let label = circularProgress.querySelector("span");
            let increaseValue = null;
            circularProgress.error = function() {
                let errorIcon = document.createElement("i");
                label.innerText = "";
                errorIcon.className = "material-icons";
                errorIcon.innerText = "close";
                label.appendChild(errorIcon);
                circularProgress.classList.add("error");
            };
            circularProgress.setProgress = function(progress) {
                if (progress < 0 || progress > 100)
                    return;
                let textValue = label.innerText.replace("%", "");
                let wait = false;
                if (circularProgress.classList.contains("completed"))
                {
                    wait = true;
                    textValue = "100";
                    let icon = circularProgress.querySelector(".material-icons");
                    icon.parentElement.removeChild(icon);
                    label.innerText = "100%";
                    circularProgress.classList.remove("completed");
                }
                if (!textValue.match("[0-9]+"))
                    return;
                if (increaseValue != null)
                {
                    clearInterval(increaseValue);
                    increaseValue = null;
                }
                let currentValue = parseInt(textValue);
                let dashArray = (progress / 100) * 300;
                let rate = 5000 / Math.abs(progress - currentValue);
                fill.style.strokeOpacity = "1";
                fill.style.strokeDasharray = `${dashArray}px, 295px`;
                let reduce;
                increaseValue = setInterval(() => {
                    textValue = label.innerText.replace("%", "");
                    if (!textValue.match("[0-9]+"))
                    {
                        clearInterval(increaseValue);
                        increaseValue = null;
                        return;
                    }
                    currentValue = parseInt(textValue);
                    if (reduce == null)
                        reduce = currentValue > progress;
                    if (wait)
                        wait = false;
                    else if (currentValue >= 100)
                    {
                        clearInterval(increaseValue);
                        increaseValue = null;
                        label.innerText = "";
                        let checkIcon = document.createElement("i");
                        checkIcon.className = "material-icons";
                        checkIcon.innerText = "check";
                        label.appendChild(checkIcon);
                        circularProgress.classList.add("completed");
                        return;
                    }
                    else if (currentValue >= progress && !reduce)
                    {
                        clearInterval(increaseValue);
                        increaseValue = null;
                        return;
                    }
                    else if (currentValue <= progress && reduce)
                    {
                        clearInterval(increaseValue);
                        increaseValue = null;
                        return;
                    }
                    if (reduce)
                        currentValue--;
                    else
                        currentValue++;
                    label.innerText = `${currentValue}%`;
                }, rate);
            };
        }
    }
    function _addDrawerMenuListeners()
    {
        function hide(menu, overlay)
        {
            setTimeout(() => {
                if (menu.classList.contains("right"))
                    menu.style.transform = "translateX(140%)";
                else if (menu.classList.contains("top"))
                    menu.style.transform = "translate(0, -140%)";
                else if (menu.classList.contains("bottom"))
                    menu.style.transform = "translate(0, 140%)";
                else
                    menu.style.transform = "translateX(-140%)";
                setTimeout(() => { overlay.classList.remove("visible"); }, 100);
                setTimeout(() => {
                    if (overlay != null && overlay.parentElement != null)
                        overlay.parentElement.removeChild(overlay);
                }, 225);
            }, 200);
        }
        let menus = document.getElementsByClassName("ux-drawer");
        for (let i = 0; i < menus.length; i++)
        {
            let menu = menus[i];
            if (menu.classList.contains("static"))
                continue;
            let triggerId = menu.getAttribute("trigger");
            if (triggerId == null)
            {
                console.log("Drawer menu has no trigger attribute. The trigger attribute is necessary for showing drawer menus");
                continue;
            }
            let trigger = document.getElementById(triggerId);
            if (trigger == null)
            {
                console.log(`Couldn't find trigger with id ${triggerId}`);
                continue;
            }
            trigger.addEventListener("click", () => {
                setTimeout(() => {
                    menu.style.transform = "translate(0, 0)";
                    let overlay = document.createElement("div");
                    overlay.className = "overlay";
                    document.documentElement.appendChild(overlay);
                    setTimeout(() => {
                        overlay.classList.add("visible");
                    }, 10);
                    menu.onclick = () => {
                        if (menu.classList.contains("auto"))
                            return;
                        hide(menu, overlay);
                    };
                    overlay.onclick = () => { hide(menu, overlay); };
                }, 50);
            });
        }
    }

    function _addSnackbarListeners()
    {
        let snackbars = document.getElementsByClassName("ux-snackbar");
        for (let i = 0; i < snackbars.length; i++)
        {
            let snackbar = snackbars[i];
            if (!snackbar.hasAttribute("trigger"))
            {
                console.log("Snackbar has no attribute trigger! A trigger is necessary for snackbars to be shown");
                continue;
            }
            let trigger = document.getElementById(snackbar.getAttribute("trigger"));
            if (trigger == null)
            {
                console.log(`Couldn't find trigger with id ${snackbar.getAttribute("trigger")} for snackbar`);
                continue;
            }

            let delay = snackbar.hasAttribute("delay") ? parseInt(snackbar.getAttribute("delay")) : 2200;
            trigger.addEventListener("click", () => showSnackbar(snackbar, delay));
            if (snackbar.classList.contains("closeable"))
            {
                let closeButton = snackbar.querySelector(".ux-icon-button");
                closeButton.addEventListener("click", () => hideSnackbar(snackbar));
            }
        }
    }
    function _addDropDownListeners()
    {
        let dropdowns = document.getElementsByClassName("ux-dropdown-menu");
        window.addEventListener("click", (e) => {
            for (let i = 0; i < dropdowns.length; i++)
            {
                function close()
                {
                    if (!dropdowns[i].classList.contains("transitioning-dropdown"))
                    {
                        dropdowns[i].style.opacity = "0";
                        dropdowns[i].style.transform = "scale(0)";
                    }
                }
                if (e.srcElement.classList.contains("ux-dropdown-item"))
                    setTimeout(() => { close(); }, 300);
                else
                    setTimeout(() => { close(); }, 10);
            }
        });
        for (let i = 0; i < dropdowns.length; i++)
        {
            let dropdown = dropdowns[i];
            if (!dropdown.hasAttribute("trigger"))
            {
                console.log("ERROR: DropDown has no attribute trigger");
                continue;
            }
            let trigger = document.getElementById(dropdown.getAttribute("trigger"));
            trigger.addEventListener("click", () => {
                let x = (trigger.getBoundingClientRect().left + window.scrollX);
                let y = (trigger.getBoundingClientRect().top + window.scrollY);
                let triggerRect = trigger.getBoundingClientRect();
                let dropdownHeight = dropdown.childElementCount * 54.0;
                if (dropdown.classList.contains("bottom-left"))
                {
                    dropdown.style.transformOrigin = "100% 0 0";
                    x -= 120.0;
                    y += triggerRect.height;
                }
                else if (dropdown.classList.contains("top-right"))
                {
                    dropdown.style.transformOrigin = "0 100% 0";
                    x += triggerRect.width;
                    y -= dropdownHeight;
                }
                else if (dropdown.classList.contains("top-left"))
                {
                    dropdown.style.transformOrigin = "bottom right";
                    x -= 120.0;
                    y -= dropdownHeight;
                }
                else
                {
                    x += triggerRect.width;
                    y += triggerRect.height;
                }
                dropdown.style.display = "flex";
                dropdown.style.top = y + "px";
                dropdown.style.left = x + "px";
                dropdown.classList.add("transitioning-dropdown");
                setTimeout(() => {
                    dropdown.style.opacity = "1";
                    dropdown.style.transform = "scale(1)";
                    setTimeout(() => {
                        dropdown.classList.remove("transitioning-dropdown");
                    }, 200);
                }, 10);
            });
        }
    }

    function _addTabListeners()
    {
        let tabBars = document.getElementsByClassName("ux-tab-bar");
        for (let i = 0; i < tabBars.length; i++)
            addTabBarEvents(tabBars[i]);
    }

    function _addContextMenuListeners()
    {
        let contextMenus = document.getElementsByClassName("context-menu");
        window.addEventListener("click", (e) => {
            for (let i = 0; i < contextMenus.length; i++)
            {
                let contextMenu = contextMenus[i];
                setTimeout(() => {
                    contextMenu.style.transform = "scale(0)";
                    contextMenu.style.opacity = 0;
                }, 200);
            }
        });
        window.oncontextmenu = (e) => {
            for (let i = 0; i < contextMenus.length; i++)
            {
                let contextMenu = contextMenus[i];
                let x = e.clientX;
                let y = e.clientY;
                contextMenu.style.top = y + "px";
                contextMenu.style.left = x + "px";
                contextMenu.style.transform = "scale(1)";
                contextMenu.style.opacity = 1;
            }
            return contextMenus.length <= 0;
        };
    }

    function _addExpansionListeners()
    {
        let expansionPanels = document.getElementsByClassName("ux-expansion-pane");
        for (let i = 0; i < expansionPanels.length; i++)
        {
            let panel = expansionPanels[i];
            let content = panel.querySelector(".ux-expansion-content");
            let control;
            let arrow = null;
            if (panel.hasAttribute("trigger"))
            {
                control = document.getElementById(panel.getAttribute("trigger"));
                if (control == null)
                {
                    console.log(`Can't find trigger with id ${panel.getAttribute("trigger")} for expansion panel`);
                    return;
                }
            }
            else
            {
                control = panel.querySelector(".ux-expansion-control");
                arrow = control.querySelector(".material-icons");
            }

            if (panel.style.display === "" && panel.classList.contains("open"))
                content.style.display = "flex";
            control.addEventListener("click", () => {
                if (content.style.display === "none" || content.style.display === "")
                {
                    content.style.display = "flex";
                    let targetHeight = content.getBoundingClientRect().height;
                    content.style.display = "none";
                    content.style.height = "0px";
                    content.style.display = "flex";
                    setTimeout(() => {
                        if (arrow != null)
                            arrow.style.transform = "rotateZ(180deg)";
                        content.style.height = targetHeight + "px";
                    }, 40);
                }
                else
                {
                    if (arrow != null)
                        arrow.style.transform = "rotateZ(0deg)";
                    content.style.height = "0px";
                    setTimeout(() => {
                        content.style.display = "none";
                        content.style.height = "unset";
                    }, 200);
                }
            });
        }
    }
    return {
        "init": function () {
            _addPopupListeners();
            _addAlertListeners();
            _addDialogListeners();
            _addSnackbarListeners();
            _addTooltipListeners();
            _addExpansionListeners();
            _addTabListeners();
            _addDrawerMenuListeners();
            _addDropDownListeners();
            _addContextMenuListeners();
            _addControlListeners();
            _addCircularProgressListeners();
            _addRippleListeners();
        }
    };
}


function addRippleEffect(rippled)
{
    rippled.addEventListener("mousedown", (e) => {
        if (rippled.classList.contains("disabled"))
            return;
        let ripple = document.createElement("div");
        ripple.className = "ripple";
        let width = rippled.getBoundingClientRect().width;
        let height = rippled.getBoundingClientRect().height;
        rippled.appendChild(ripple);
        ripple.style.width = (width > height ? width : height) + "px";
        ripple.style.height = (width > height ? width : height) + "px";
        setTimeout(() => {
            let size = rippled.offsetWidth;
            let pos = rippled.getBoundingClientRect();
            let x = e.clientX - pos.left - (size / 2);
            let y = e.clientY - pos.top - (size / 2);
            ripple.style.top = y + "px";
            ripple.style.left = x + "px";
            ripple.style.transform = "scale(2, 2)";
            ripple.style.opacity = "1";
        }, 0);
    });
    rippled.addEventListener("mouseup", () => {
        if (rippled.classList.contains("disabled"))
            return;
        let children = rippled.children;
        for (var i = 0; i < children.length; i++)
        {
            var child = children[i];
            if (child.classList.contains("ripple"))
            {
                setTimeout(() => {
                    child.style.opacity = "0";
                    setTimeout(() => {
                        if (child.parentNode != null)
                        {
                            child.parentNode.removeChild(child);
                        }
                    }, 400);
                }, 300);
            }
        }
    });
}

/**
 *
 * @param trigger {Element}
 * @param text {string}
 */
function addTooltip(trigger, text)
{
    let tooltip = document.createElement("div");
    tooltip.className = "ux-tooltip";
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    tooltip.style.opacity = "0";
    tooltip.style.display = "unset";
    let width = tooltip.getBoundingClientRect().width;
    let height = tooltip.getBoundingClientRect().height;
    tooltip.style.display = "none";
    let isHovering = false;
    let showTimeout;
    trigger.addEventListener("mouseenter", (e) => {
        isHovering = true;
        let triggerRect = trigger.getBoundingClientRect();
        let x = (triggerRect.left + (triggerRect.width / 2.0)) - (width / 2.0);
        let y = (triggerRect.top + (triggerRect.height / 2.0)) + height / 2.0;
        let delay = trigger.hasAttribute("delay") ? parseInt(trigger.getAttribute("delay")) : 20;
        tooltip.style.top = y + "px";
        tooltip.style.left = x + "px";
        tooltip.style.display = "unset";
        showTimeout = setTimeout(() => {
            if (isHovering)
            {
                tooltip.style.opacity = "1";
                tooltip.style.transform = "translateY(90%)";
            }
            else
                clearTimeout(showTimeout);
        }, delay);
    });

    trigger.addEventListener("mouseleave", (e) => {
        isHovering = false;
        clearTimeout(showTimeout);
        setTimeout(() => {
            if (!isHovering)
            {
                tooltip.style.opacity = "0";
                tooltip.style.transform = "translateY(0%)";
            }
            setTimeout(() => {
                if (!isHovering)
                    tooltip.style.display = "none";
            }, 1000);
        }, 100);
    });
}

function createDialog(dialogConfig)
{
    let dialog = document.createElement("div");
    let dialogMsg = document.createElement("div");
    let dialogTitle = document.createElement("div");
    let dialogControls = document.createElement("div");
    let overlay = document.createElement("div");
    overlay.className = "overlay";
    dialog.className = "dialog";
    dialogMsg.className = "dialog-message";
    dialogTitle.className = "dialog-title";
    dialogControls.className = "dialog-controls";
    dialogTitle.innerText = dialogConfig.title;
    dialogMsg.innerText = dialogConfig.message;
    for (let i = 0; i < dialogConfig.buttons.length; i++)
    {
        let btnConfig = dialogConfig.buttons[i];
        let btn = document.createElement("div");
        btn.className = "ux-text-button rippled primary small";
        addRippleEffect(btn);
        btn.innerText = btnConfig.title;
        dialogControls.appendChild(btn);
    }
    dialog.appendChild(dialogTitle);
    dialog.appendChild(dialogMsg);
    dialog.appendChild(dialogControls);
    return {
        overlay: overlay,
        dialog: dialog,
        show: () => { showDialog(dialog, overlay); }
    };
}

function showDialog(dialog, overlay)
{
    document.documentElement.appendChild(dialog);
    document.documentElement.appendChild(overlay);
    dialog.style.display = "flex";
    overlay.style.display = "unset";
    setTimeout(() => {
        dialog.style.opacity = "1.0";
        overlay.style.opacity = "1.0";

    }, 10);
    let buttons = dialog.querySelectorAll(".ux-text-button");
    for (let i = 0; i < buttons.length; i++)
    {
        buttons[i].onclick = () => hide();
    }
    overlay.onclick = () => hide();
    function hide()
    {
        setTimeout(() => {
            dialog.style.opacity = "0";
            overlay.style.opacity = "0";
            setTimeout(() => {
                dialog.parentElement.removeChild(dialog);
                overlay.parentElement.removeChild(overlay);
            }, 600);
        }, 150);
    }
}

function addTabBarEvents(tabBar)
{
    let tabItems = tabBar.querySelectorAll(".ux-tab-item");
    let indicator = document.createElement("div");
    indicator.className = "tab-indicator";
    if (tabBar.querySelector(".active-tab") == null)
        tabItems[0].classList.add("active-tab");
    tabBar.appendChild(indicator);
    indicator.style.width = 100.0 / tabItems.length + "%";
    for (let j = 0; j < tabItems.length; j++)
    {
        let item = tabItems[j];
        item.addEventListener("click", (e) => {
            if (item.classList.contains("disabled"))
                return;
            tabBar.querySelector(".active-tab").classList.remove("active-tab");
            item.classList.add("active-tab");
            let index = j;
            let transform = 100.0 * index;
            indicator.style.transform = "translateX(" + transform + "%)";
        });
    }
}

function hideSnackbar(snackbar)
{
    setTimeout(() => {
        snackbar.style.transform = "translate(-50%, 100%)";
    }, 100);
}

function showSnackbar(snackbar, delay)
{
    snackbar.style.transform = "translate(-50%, 0%)";
    if (!snackbar.classList.contains("closeable"))
    {
        setTimeout(() => {
            snackbar.style.transform = "translate(-50%, 100%)";
        }, delay);
    }
}


