use std::path::PathBuf;
use tauri::{AppHandle, Manager, WebviewWindow};

// ==================== ウィンドウ操作 ====================

#[tauri::command]
fn set_always_on_top(window: WebviewWindow, value: bool) {
    let _ = window.set_always_on_top(value);
}

// ==================== フレームデータ永続化 ====================

fn frames_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("frames");
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir)
}

/// 更新済みJSONをアプリデータフォルダに保存
#[tauri::command]
fn save_frame_data(app: AppHandle, slug: String, data: String) -> Result<(), String> {
    let path = frames_dir(&app)?.join(format!("{}.json", slug));
    std::fs::write(path, data).map_err(|e| e.to_string())
}

/// アプリデータフォルダから読み込む（なければNone）
#[tauri::command]
fn load_user_frame_data(app: AppHandle, slug: String) -> Result<Option<String>, String> {
    let path = frames_dir(&app)?.join(format!("{}.json", slug));
    if path.exists() {
        let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
        Ok(Some(content))
    } else {
        Ok(None)
    }
}

/// バージョン情報をアプリデータフォルダに保存
#[tauri::command]
fn save_update_version(app: AppHandle, data: String) -> Result<(), String> {
    let path = frames_dir(&app)?.join("_version.json");
    std::fs::write(path, data).map_err(|e| e.to_string())
}

/// バージョン情報を読み込む
#[tauri::command]
fn load_update_version(app: AppHandle) -> Result<Option<String>, String> {
    let path = frames_dir(&app)?.join("_version.json");
    if path.exists() {
        let content = std::fs::read_to_string(path).map_err(|e| e.to_string())?;
        Ok(Some(content))
    } else {
        Ok(None)
    }
}

// ==================== エントリポイント ====================

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![
            set_always_on_top,
            save_frame_data,
            load_user_frame_data,
            save_update_version,
            load_update_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
