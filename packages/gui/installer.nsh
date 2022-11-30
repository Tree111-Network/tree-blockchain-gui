!include "nsDialogs.nsh"

; Add our customizations to the finish page
!macro customFinishPage
XPStyle on

Var DetectDlg
Var FinishDlg
Var TreeSquirrelInstallLocation
Var TreeSquirrelInstallVersion
Var TreeSquirrelUninstaller
Var CheckboxUninstall
Var UninstallTreeSquirrelInstall
Var BackButton
Var NextButton

Page custom detectOldTreeVersion detectOldTreeVersionPageLeave
Page custom finish finishLeave

; Add a page offering to uninstall an older build installed into the tree-blockchain dir
Function detectOldTreeVersion
  ; Check the registry for old tree-blockchain installer keys
  ReadRegStr $TreeSquirrelInstallLocation HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\tree-blockchain" "InstallLocation"
  ReadRegStr $TreeSquirrelInstallVersion HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\tree-blockchain" "DisplayVersion"
  ReadRegStr $TreeSquirrelUninstaller HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\tree-blockchain" "QuietUninstallString"

  StrCpy $UninstallTreeSquirrelInstall ${BST_UNCHECKED} ; Initialize to unchecked so that a silent install skips uninstalling

  ; If registry keys aren't found, skip (Abort) this page and move forward
  ${If} TreeSquirrelInstallVersion == error
  ${OrIf} TreeSquirrelInstallLocation == error
  ${OrIf} $TreeSquirrelUninstaller == error
  ${OrIf} $TreeSquirrelInstallVersion == ""
  ${OrIf} $TreeSquirrelInstallLocation == ""
  ${OrIf} $TreeSquirrelUninstaller == ""
  ${OrIf} ${Silent}
    Abort
  ${EndIf}

  ; Check the uninstall checkbox by default
  StrCpy $UninstallTreeSquirrelInstall ${BST_CHECKED}

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $DetectDlg

  ${If} $DetectDlg == error
    Abort
  ${EndIf}

  !insertmacro MUI_HEADER_TEXT "Uninstall Old Version" "Would you like to uninstall the old version of Tree Blockchain?"

  ${NSD_CreateLabel} 0 35 100% 12u "Found Tree Blockchain $TreeSquirrelInstallVersion installed in an old location:"
  ${NSD_CreateLabel} 12 57 100% 12u "$TreeSquirrelInstallLocation"

  ${NSD_CreateCheckBox} 12 81 100% 12u "Uninstall Tree Blockchain $TreeSquirrelInstallVersion"
  Pop $CheckboxUninstall
  ${NSD_SetState} $CheckboxUninstall $UninstallTreeSquirrelInstall
  ${NSD_OnClick} $CheckboxUninstall SetUninstall

  nsDialogs::Show

FunctionEnd

Function SetUninstall
  ; Set UninstallTreeSquirrelInstall accordingly
  ${NSD_GetState} $CheckboxUninstall $UninstallTreeSquirrelInstall
FunctionEnd

Function detectOldTreeVersionPageLeave
  ${If} $UninstallTreeSquirrelInstall == 1
    ; This could be improved... Experiments with adding an indeterminate progress bar (PBM_SETMARQUEE)
    ; were unsatisfactory.
    ExecWait $TreeSquirrelUninstaller ; Blocks until complete (doesn't take long though)
  ${EndIf}
FunctionEnd

Function finish

  ; Magic create dialog incantation
  nsDialogs::Create 1018
  Pop $FinishDlg

  ${If} $FinishDlg == error
    Abort
  ${EndIf}

  GetDlgItem $NextButton $HWNDPARENT 1 ; 1 = Next button
  GetDlgItem $BackButton $HWNDPARENT 3 ; 3 = Back button

  ${NSD_CreateLabel} 0 35 100% 12u "Tree has been installed successfully!"
  EnableWindow $BackButton 0 ; Disable the Back button
  SendMessage $NextButton ${WM_SETTEXT} 0 "STR:Let's Farm!" ; Button title is "Close" by default. Update it here.

  nsDialogs::Show

FunctionEnd

; Copied from electron-builder NSIS templates
Function StartApp
  ${if} ${isUpdated}
    StrCpy $1 "--updated"
  ${else}
    StrCpy $1 ""
  ${endif}
  ${StdUtils.ExecShellAsUser} $0 "$launchLink" "open" "$1"
FunctionEnd

Function finishLeave
  ; Launch the app at exit
  Call StartApp
FunctionEnd

; Section
; SectionEnd
!macroend
