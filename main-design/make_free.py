"""Build the copy "C2 - 家具（自由摆放）" (2026-10-22, the user: 客厅让我可以自己摆放旋转家具，创建一个副本) from the furniture
page: the same model plus free_mode.js (drag / turn the living pieces, a catalogue of the pieces the user liked, the gaps
to walls and to the nearest piece, copy / paste a layout), opening on a top view of the living room.
Usage: make_free.py <scratchpad>  ->  <scratchpad>/c2-living-free.html"""
import io, json, re, sys
S = sys.argv[1]; t = io.open(S + "/c2-living-3d.html", encoding="utf-8").read()
js = io.open(S + "/free_mode.js", encoding="utf-8").read(); css = io.open(S + "/free.css", encoding="utf-8").read(); box = io.open(S + "/free_box.html", encoding="utf-8").read()


def rep(a, b, count=1):
    global t
    assert t.count(a) == count, (t.count(a), a[:100]); t = t.replace(a, b)


TITLE = "C2 - 家具（自由摆放）"
# since 2026-10-23 this is THE furniture page (删除普通版，全部同步成Home-3d): the title stays C2 - 家具
rep("</style>", css + "</style>")
rep('<canvas id="view" aria-label="全屋三维模型，可拖动旋转"></canvas>\n', '<canvas id="view" aria-label="全屋三维模型，可拖动旋转"></canvas>\n' + box)
rep("  ltop:    { pos: [9.35, 7.6, 3.76], target: [9.35, 0, 3.75], fov: 50 },   // straight down (2026-10-25)", "  ltop:    { pos: [9.35, 7.6, 3.76], target: [9.35, 0, 3.75], fov: 50 },   // straight down (2026-10-25)\n  ftop:    { pos: [9.35, 7.6, 3.76], target: [9.35, 0, 3.75], fov: 50 },   // straight down, for arranging")
rep("const LIV_VIEWS = ['dining', 'balcony', 'facing', 'lback', 'corner', 'table', 'ltop'];", "const LIV_VIEWS = ['dining', 'balcony', 'facing', 'lback', 'corner', 'table', 'ltop', 'ftop'];")
rep("setView('entry', true);\n", "setView('entry', true);\n" + js + "FREE.init();\nif (!window.FREE_HIDE) setView('ltop', true);\n")
rep("[sheetEl, viewBar].forEach(el => trObs.observe(el, { childList: true, subtree: true, characterData: true }));",
    "[sheetEl, viewBar, document.getElementById('freeBox')].forEach(el => trObs.observe(el, { childList: true, subtree: true, characterData: true }));")
rep("  trTree(sheetEl); trTree(viewBar);\n", "  trTree(sheetEl); trTree(viewBar); trTree(document.getElementById('freeBox'));\n")
m = re.search(r"const EN = (\{.*?\});\n", t); EN = json.loads(m.group(1)); m2 = re.search(r"const KO = (\{.*?\});\n", t); KO = json.loads(m2.group(1))
NEW = {
    TITLE: ["C2 - Furniture (free arrangement)", "C2 - 가구(자유 배치)"],
    "自由摆放": ["Free arrangement", "자유 배치"],
    "收起": ["Fold", "접기"], "展开": ["Open", "펼치기"],
    "点家具选中，按住拖动；下面的按钮转角度。键盘：Q / E 转 5°，按住 Shift 转 45°，Delete 收起。壁挂拖到沙发墙或书房墙附近会自动贴墙。地上的红虚线是客厅边界（书房墙尽头）。":
        ["Click a piece to select it, hold and drag to move it; turn it with the buttons below. Keys: Q / E turn 5°, with Shift 45°, Delete puts it away. A wall shelf dragged near the sofa wall or the study wall snaps onto it. The red dashed line on the floor is the living room's edge (where the study wall ends).",
         "가구를 클릭해 선택하고 끌어서 옮기기; 아래 버튼으로 회전. 키: Q / E 5°, Shift 누르면 45°, Delete 치우기. 선반은 벽 가까이 끌면 벽에 붙음. 바닥의 빨간 점선은 거실 경계."],
    "还没选家具": ["Nothing selected", "선택 없음"],
    "点一下家具选中它，按住拖动。": ["Click a piece to select it, hold to drag it.", "가구를 클릭해 선택, 누른 채로 끌기."],
    "逆时针 45°": ["45° anticlockwise", "반시계 45°"], "逆时针 5°": ["5° anticlockwise", "반시계 5°"], "顺时针 5°": ["5° clockwise", "시계 5°"], "顺时针 45°": ["45° clockwise", "시계 45°"],
    "收起这件": ["Put away", "치우기"],
    "家具库（点一下放进客厅，可以放多件）": ["Pieces (click to put one in the living room; more than one is fine)", "가구 목록(클릭하면 거실에 하나 추가)"],
    "俯视": ["Top view", "위에서"], "恢复默认": ["Back to default", "기본값으로"], "复制布局": ["Copy layout", "배치 복사"], "粘贴布局": ["Paste layout", "배치 붙여넣기"],
    "关掉自由摆放": ["Turn free arrangement off", "자유 배치 끄기"], "打开自由摆放": ["Turn free arrangement on", "자유 배치 켜기"], "摆放俯视": ["Top view (arrange)", "배치용 위에서"],
    "乐园沙发 2.6": ["乐园 sofa 2.6", "러위안 소파 2.6"], "乐园沙发 2.9": ["乐园 sofa 2.9", "러위안 소파 2.9"], "骏马扶手椅": ["骏马 armchair", "준마 암체어"],
    "藤编扶手椅": ["Rattan armchair", "라탄 암체어"], "原来的转椅": ["The original swivel chair", "원래 회전의자"], "卡门凳": ["Carmen stool", "카르멘 스툴"],
    "让纳雷休闲椅": ["Jeanneret easy chair", "잔느레 이지체어"], "牛皮长凳": ["Cowhide bench", "소가죽 벤치"], "树瘤茶几 100×50": ["Burl coffee table 100×50", "버얼 커피 테이블 100×50"],
    "劳伦黑岩板茶几 100×55": ["Nero Laurent stone table 100×55", "네로 로랑 석재 테이블 100×55"], "黑柱＋紫色兰花": ["Black column + purple orchid", "검은 기둥 + 보라 난"],
    "黑碳化木方柱": ["Black carbonized column", "검은 탄화목 기둥"], "小铁边几": ["Small iron side table", "작은 철제 사이드 테이블"], "绿色平织地毯 160×230": ["Sage flat-weave rug 160×230", "세이지 평직 러그 160×230"],
    "转角 0°": ["turned 0°", "회전 0°"], "顺时针": ["clockwise", "시계 방향"], "逆时针": ["anticlockwise", "반시계 방향"],
    "压进墙里": ["into the wall by", "벽에 묻힘"], "离沙发墙": ["to the sofa wall", "소파 벽까지"], "离书房墙": ["to the study wall", "서재 벽까지"], "离窗": ["to the glass", "유리까지"],
    "超出客厅线": ["past the living-room line", "거실 선 넘음"], "重叠：": ["Overlaps: ", "겹침: "], "最近：": ["Nearest: ", "가장 가까움: "],
    "C2 客厅自由摆放（中心点 mm：沙发墙 x7995，书房墙 x10700，窗 y1830，客厅线 y5100）": ["C2 living room, free arrangement (centres in mm: sofa wall x7995, study wall x10700, glass y1830, living line y5100)", "C2 거실 자유 배치(중심점 mm)"],
    "白圆柱 30＋紫色兰花": ["White round plinth 30 + purple orchid", "흰 원기둥 30 + 보라 난"],
    "恢复默认会盖掉你现在的摆法（想留着就先点复制布局），确定吗？": ["Back to default replaces your arrangement (copy the layout first to keep it). Go ahead?", "기본값으로 되돌리면 지금 배치가 사라집니다(먼저 배치 복사). 계속할까요?"],
    "我的组合（存在这个浏览器里）": ["My arrangements (kept in this browser)", "내 배치(이 브라우저에 저장)"],
    "打开": ["Open", "열기"], "存为": ["Save as", "저장"], "组合": ["Set ", "배치 "], "组合A": ["Set A", "배치 A"], "组合B": ["Set B", "배치 B"], "组合C": ["Set C", "배치 C"],
    "已经存过了，用现在的摆法覆盖吗？": ["is already saved - replace it with the current arrangement?", "이미 저장됨 - 지금 배치로 바꿀까요?"], "已存": ["Saved", "저장됨"],
    "白色圆柱边几 Φ30": ["White round side table Φ30", "흰 원기둥 사이드 테이블 Φ30"], "黑色圆柱边几 Φ30": ["Black round side table Φ30", "검은 원기둥 사이드 테이블 Φ30"], "高度": ["height", "높이"],
    "黑色壁挂＋兰花": ["Black wall shelf + orchid", "검은 벽 선반 + 난"], "白色壁挂＋兰花": ["White wall shelf + orchid", "흰 벽 선반 + 난"], "松绿色壁挂＋兰花": ["Pine-green wall shelf + orchid", "솔잎색 벽 선반 + 난"], "挂高": ["hung at", "설치 높이"],
    "形状": ["shape", "모양"], "竖方": ["upright", "세로"], "半圆": ["half-round", "반원"], "扁方": ["flat", "납작"],
    "十八纸 D45": ["Honeycomb paper D45", "허니콤 종이 D45"], "十八纸 D35": ["Honeycomb paper D35", "허니콤 종이 D35"],
    "保存修改到组合": ["Save changes to set ", "변경 사항 저장: 배치 "], "再点一次覆盖": ["Click again to replace", "한 번 더 누르면 덮어쓰기"],
    "再点一次恢复默认": ["Click again to reset", "한 번 더 누르면 기본값"], "确定": ["OK", "확인"], "关掉": ["Close", "닫기"],
    "复制下面这段发给 Claude": ["Copy this and send it to Claude", "이것을 복사해 Claude에게 보내기"], "把 Claude 给你的布局粘贴在这里，再点确定": ["Paste the layout from Claude here, then OK", "Claude의 배치를 붙여넣고 확인"],
    "C形亚克力边几": ["Acrylic C side table", "아크릴 C형 사이드 테이블"], "颜色": ["colour", "색상"], "转椅": ["Swivel", "회전의자"], "原样": ["as is", "그대로"], "朝窗": ["to the window", "창 쪽"],
    "两本书": ["Two books", "책 두 권"], "兰花瓶（紫色蝴蝶兰）": ["Orchid bud vase (purple)", "난 화병(보라)"], "宽扶手沙发 2.6（新）": ["Wide-arm sofa 2.6 (new)", "넓은 팔걸이 소파 2.6(신규)"],
    "放在：": ["On: ", "위치: "], "地上": ["the floor", "바닥"], "餐桌": ["the dining table", "식탁"],
    "藤编躺椅（黑框）60×82": ["Cane lounge chair, black frame 60×82", "등나무 라운지 체어(검은 프레임) 60×82"],
    "宽扶手沙发 2.4（定制）": ["Wide-arm sofa 2.4 (made to order)", "넓은 팔걸이 소파 2.4(맞춤)"],
    "尺寸（长×宽×高）": ["Size (L × W × H)", "크기(길이×폭×높이)"], "尺寸（宽×深×高）": ["Size (W × D × H)", "크기(폭×깊이×높이)"],
    "尺寸（直径×高）": ["Size (diameter × H)", "크기(지름×높이)"], "尺寸（长×宽）": ["Size (L × W)", "크기(길이×폭)"], "壁挂尺寸（宽×深×高）": ["Shelf size (W × D × H)", "선반 크기(폭×깊이×높이)"],
    "（按 3150×1220×750 等比估算）": [" (scaled from 3150×1220×750)", " (3150×1220×750 비례 추정)"],
    "玻璃花瓶 Φ5.4×11 cm，连兰花约高 51 cm": ["Glass vase Φ5.4×11 cm, about 51 cm tall with the orchid", "유리 화병 Φ5.4×11 cm, 난 포함 약 51 cm"],
    "十八纸圆柱（白）": ["Honeycomb-paper column (white)", "허니콤 종이 원기둥(흰색)"], "散尾葵（高棕榈）": ["Areca palm (tall)", "아레카 야자(큰 것)"],
    "花盆": ["Pot", "화분"], "编织篮": ["Woven basket", "바구니"], "白色盆": ["White pot", "흰 화분"], "直径": ["Diameter", "지름"],
    "尺寸（冠幅×高）": ["Size (spread × H)", "크기(폭×높이)"], "纱帘（客厅落地窗）": ["Sheer (living-room glass)", "시어 커튼(거실 유리창)"],
    "不要": ["None", "없음"], "拉开": ["Open", "열기"], "拉上": ["Drawn", "닫기"],
    "转椅": ["Swivel chair", "회전의자"],
    "点家具选中，按住拖动；下面的按钮转角度。键盘：Q / E 转 5°，按住 Shift 转 45°，Delete 收起。地上的红虚线是客厅边界（书房墙尽头）。": ["Click a piece to select it, hold and drag to move it; turn it with the buttons below. Keys: Q / E turn 5°, with Shift 45°, Delete puts it away. The red dashed line on the floor is the living room's edge (where the study wall ends).", "가구를 클릭해 선택하고 끌어서 옮기기; 아래 버튼으로 회전. 키: Q / E 5°, Shift 누르면 45°, Delete 치우기. 바닥의 빨간 점선은 거실 경계."],
    "天堂鸟（大叶）": ["Bird of paradise (big leaves)", "극락조화(큰 잎)"], "棕竹（耐阴）": ["Lady palm (low light)", "관음죽(그늘 OK)"], "橡皮树（耐阴）": ["Rubber plant (low light)", "고무나무(그늘 OK)"],
    "虎尾兰（桌面）": ["Snake plant (tabletop)", "산세베리아(탁상)"], "富贵竹（玻璃瓶）": ["Lucky bamboo (glass vase)", "개운죽(유리병)"], "白瓷盆": ["White glazed pot", "흰 자기 화분"], "玻璃瓶": ["Glass vase", "유리병"],
    "在阳台": ["On the balcony", "발코니에"],
    "鱼尾葵（本土棕榈）": ["Fishtail palm (native)", "공작야자(토종)"], "观音竹（竹丛）": ["Hedge bamboo (clump)", "봉래죽(덤불)"], "鸡蛋花（小树）": ["Frangipani (small tree)", "플루메리아(작은 나무)"],
    "木瓜（矮种，盆栽）": ["Papaya (dwarf, potted)", "파파야(왜성, 화분)"],
    "咖喱叶（小树）": ["Curry leaf (small tree)", "커리잎 나무"],
    "电视 55寸（壁挂）": ["TV 55in (wall-hung)", "TV 55인치(벽걸이)"], "电视 65寸（壁挂）": ["TV 65in (wall-hung)", "TV 65인치(벽걸이)"], "藤门矮柜 160×38×50": ["Low cane-door console 160×38×50", "등나무 문 낮은 장 160×38×50"],
    "植物版画一对 50×70": ["Pair of botanical prints 50×70", "식물 판화 한 쌍 50×70"], "屏幕": ["Screen", "화면"], "两幅画框": ["Two frames", "액자 두 개"], "中心高": ["centre at", "중심 높이"],
    "悬空藤门窄柜 120×25×35": ["Hung cane-door cabinet 120×25×35", "벽걸이 등나무 문 수납장 120×25×35"], "移动电视（推车 65寸）": ["Movable TV (65in on a trolley)", "이동식 TV(65인치 카트)"], "柜面高": ["top at", "상판 높이"],
    "移动电视（银翼V字架）": ["Movable TV (silver V-leg stand)", "이동식 TV(은색 V자 스탠드)"],
    "殖民风书墙 240×30×220": ["Colonial bookcase wall 240×30×220", "콜로니얼 책장 벽 240×30×220"], "殖民风矮书柜 240×30×110": ["Low colonial bookcase 240×30×110", "낮은 콜로니얼 책장 240×30×110"],
    "柜门": ["Doors", "문"], "藤编门": ["Cane", "등나무"], "百叶门": ["Louvred", "루버"],
    "殖民风窄书柜 55×30×200": ["Narrow colonial bookcase 55×30×200", "좁은 콜로니얼 책장 55×30×200"],
    "藤编路由器盒 36×13×22（挂墙）": ["Cane router box 36×13×22 (wall-hung)", "등나무 공유기 박스 36×13×22(벽걸이)"],
    "草编篮 Φ34×32（藏路由器）": ["Seagrass basket Φ34×32 (router inside)", "해초 바구니 Φ34×32(공유기 수납)"],
    "实木书报边几 50×30×50（尺寸估）": ["Wooden side table with magazine slot 50×30×50 (est.)", "원목 잡지꽂이 사이드 테이블 50×30×50(추정)"], "客厅方向": ["Living room facing", "거실 방향"],
    "沙发靠右墙（现在）": ["Sofa on the right wall (now)", "소파 오른쪽 벽(현재)"], "沙发靠光纤墙": ["Sofa on the fibre wall", "소파 광케이블 벽 쪽"],
    "黑格栅玻璃茶几 100×50": ["Black-grid glass coffee table 100×50", "블랙 격자 유리 테이블 100×50"],
    "黑木藤格方边几 45×45×50": ["Black wood side table with cane shelf 45×45×50", "블랙 원목 라탄 선반 사이드 테이블 45×45×50"],
    "黑色四层架边几 45×38×67": ["Black four-tier shelf side table 45×38×67", "블랙 4단 선반 사이드 테이블 45×38×67"],
    "树瘤圆柱 Φ30": ["Burl column Φ30", "버얼 원기둥 Φ30"],
    "黑色拱门边几·大 40×40×45（一套三个叠放）": ["Black arch side table L 40×40×45 (nested set of three)", "블랙 아치 사이드 테이블 대 40×40×45(3개 세트 겹침)"],
    "黑色拱门边几·中 35×35×42": ["Black arch side table M 35×35×42", "블랙 아치 사이드 테이블 중 35×35×42"],
    "黑色拱门边几·小 28×28×40": ["Black arch side table S 28×28×40", "블랙 아치 사이드 테이블 소 28×28×40"],
    "黑色椭圆C形边几 高55（面约45×35，尺寸估）": ["Black oval C side table, 55 high (top ~45×35, est.)", "블랙 타원 C형 사이드 테이블 높이 55(상판 약 45×35, 추정)"],
    "斜塔边几 40×30×43（黑）": ["Slant side table 40×30×43 (black)", "사선 사이드 테이블 40×30×43(블랙)"],
    "树瘤圆角茶几 100×70×35": ["Burl coffee table 100×70×35", "버얼 라운드 커피 테이블 100×70×35"],
    "筇竹青云茶几 105×58×45（黑框藤面）": ["Bamboo-rim tea table 105×58×45 (black, cane top)", "대나무 테두리 티 테이블 105×58×45(블랙, 라탄 상판)"],
    "水葫芦编织茶几 100×50×38（深色）": ["Water-hyacinth coffee table 100×50×38 (dark)", "부레옥잠 짜임 커피 테이블 100×50×38(다크)"],
    "藤编躺椅 60×82": ["Cane lounge chair 60×82", "등나무 라운지 체어 60×82"], "框架": ["Frame", "프레임"],
    "树瘤圆角茶几 90×63×35": ["Burl coffee table 90×63×35", "버얼 라운드 커피 테이블 90×63×35"], "树瘤圆角茶几 80×56×35": ["Burl coffee table 80×56×35", "버얼 라운드 커피 테이블 80×56×35"],
    "缅甸柚木小茶桌 70×40×25": ["Burmese teak low tea table 70×40×25", "미얀마 티크 좌식 티 테이블 70×40×25"], "柚木色": ["Teak", "티크색"],
    "餐厅（点餐桌可以拖动）": ["Dining (drag the table)", "식당(테이블을 끌어서 이동)"], "骏马 4把+宝宝椅": ["骏马 ×4 + Stokke", "준마 4개 + 아기 의자"], "骏马 6把": ["骏马 ×6", "준마 6개"],
    "利默 4把+宝宝椅": ["利默 ×4 + Stokke", "리모 4개 + 아기 의자"], "横放": ["Across", "가로로"], "竖放": ["Along the room", "세로로"], "放回原位": ["Back to its place", "제자리로"],
    "骏马扶手椅 4 把（两边各 2 把）+ 宝宝椅在桌头。": ["Four 骏马 armchairs (two a side) + the Stokke at the end.", "준마 팔걸이 의자 4개(양쪽 2개씩) + 끝에 아기 의자."],
    "骏马扶手椅 6 把（两边各 3 把）：很挤，宝宝椅放不下，适合来客人。": ["Six 骏马 armchairs (three a side): tight, no room for the Stokke - for guests.", "준마 팔걸이 의자 6개(양쪽 3개씩): 빡빡하고 아기 의자 자리 없음 - 손님용."],
    "利默椅 4 把（两边各 2 把）+ 宝宝椅在桌头。": ["Four 利默 chairs (two a side) + the Stokke at the end.", "리모 의자 4개(양쪽 2개씩) + 끝에 아기 의자."],
    "已选中餐桌：按住拖动，Q / E 转 5°，或者用上面的按钮。": ["Dining set selected: drag it, Q / E turns 5°, or use the buttons above.", "식당 세트 선택됨: 끌어서 이동, Q / E로 5° 회전, 또는 위 버튼."],
    "点一下餐桌或椅子就能拖动整套；吊灯先不动，定了位置再改。": ["Press the table or a chair to drag the whole set; the pendant stays put until you decide.", "테이블이나 의자를 눌러 세트 전체를 이동; 조명은 위치를 정한 뒤에 옮김."],
    "缅甸柚木茶几 90×45×40": ["Burmese teak coffee table 90×45×40", "미얀마 티크 커피 테이블 90×45×40"],
    "靠墙那边": ["Wall side", "벽 쪽"], "卡座 120": ["Banquette 120", "벤치 소파 120"], "卡座 140": ["Banquette 140", "벤치 소파 140"], "长凳 120": ["Bench 120", "벤치 120"], "长凳 140": ["Bench 140", "벤치 140"],
    "⚠ 进墙了，挪出来一点": ["⚠ In a wall - move it out a little", "⚠ 벽에 들어감 - 조금 빼 주세요"], "⚠ 餐桌或椅子进墙了。": ["⚠ The table or a chair is in a wall.", "⚠ 테이블이나 의자가 벽에 들어감."],
    "⚠ 地毯进墙了。": ["⚠ The rug is in a wall.", "⚠ 러그가 벽에 들어감."], "点一下地毯就能拖动，可以转 90°。": ["Press the rug to drag it; it can turn 90°.", "러그를 눌러 끌 수 있고 90° 돌릴 수 있음."],
    "玄关地毯（点地毯可以拖动）": ["Hall rug (drag it)", "현관 러그(끌어서 이동)"], "剑麻棕": ["Brown sisal", "갈색 사이잘"], "原色剑麻": ["Natural sisal", "내추럴 사이잘"], "鼠尾草绿": ["Sage", "세이지"],
    "象牙白": ["Ivory", "아이보리"], "炭灰": ["Charcoal", "차콜"], "转 90°": ["Turn 90°", "90° 회전"], "放回门口": ["Back by the door", "문 앞으로"],
    "玄关柜和餐边柜": ["the entrance cabinet and sideboard", "현관장과 사이드보드"], "右边书架柜": ["the right bookcase unit", "오른쪽 책장"], "冰箱": ["the fridge", "냉장고"],
    "厨房台面": ["the kitchen counter", "주방 상판"], "电箱柜": ["the DB/storage closet", "분전함 수납장"], "墙": ["a wall", "벽"], "⚠ 撞到": ["⚠ Runs into ", "⚠ 부딪힘: "], "了。": [".", "."],
    "⚠ 最窄处离": ["⚠ At the tightest only ", "⚠ 가장 좁은 곳: "], "只有": [" away from", ""], "cm，太挤（坐下至少留 30cm，后面要走人留 60cm）。": [" cm - too tight (30 cm to sit, 60 cm to walk behind).", "cm - 너무 좁음(앉으려면 30cm, 뒤로 지나가려면 60cm)."],
    "最窄处离": ["Tightest: ", "가장 좁은 곳: "], "cm。": [" cm.", "cm."], "⚠ 进墙或撞到柜子了，挪出来一点": ["⚠ In a wall or a built-in - move it out a little", "⚠ 벽이나 붙박이장에 들어감 - 조금 빼 주세요"],
    "玄关小凳（选了黄色或绿色小凳后，点凳子可以拖动）": ["Hall stool (with the yellow or green stool chosen, drag it)", "현관 스툴(노랑·초록 스툴을 고른 뒤 끌어서 이동)"], "放回画下面": ["Back under the picture", "그림 아래로"],
    "玄关柜": ["the entrance cabinet", "현관장"], "餐边柜": ["the sideboard", "사이드보드"],
    "固定家具": ["Fix the furniture", "가구 고정"], "继续摆放": ["Arrange again", "다시 배치"], "设为默认": ["Make default", "기본으로"], "已设为默认": ["Now the default", "기본으로 설정됨"],
    "现在的布局": ["The layout now", "지금 배치"], "已设为这个浏览器的默认（恢复默认就回到它）。想让发布的页面也默认这样，把下面这段发给 Claude。": [" is now the default in this browser (Reset brings it back). To make it the default of the published page, send Claude the text below.", "을(를) 이 브라우저의 기본으로 설정함(기본값 복원 시 이 배치로). 공개 페이지의 기본으로 하려면 아래 내용을 Claude에게 보내세요."],
    "C2 默认组合": ["C2 default layout", "C2 기본 배치"],
    "沙发和椅子": ["Sofa and chairs", "소파와 의자"], "边几": ["Side tables", "사이드 테이블"], "装饰和收纳": ["Decor and storage", "장식과 수납"], "其他": ["Other", "기타"],
    "窗帘": ["Curtains", "커튼"], "纱帘": ["Sheer", "시어 커튼"], "餐桌": ["Table", "테이블"], "玄关地毯": ["Hall rug", "현관 러그"], "客厅方向": ["Living room facing", "거실 방향"],
    "餐桌和椅子": ["the dining table and chairs", "식탁과 의자"], "椭圆桌 140×85": ["Oval table 140×85", "타원 테이블 140×85"], "整套约": ["whole set about", "세트 전체 약"],
    "⚠ 在开门的范围里，门会撞到。": ["⚠ In the front door's swing - the door will hit it.", "⚠ 현관문이 열리는 범위 안 - 문에 부딪힘."],
    "门会扫过地毯：要选薄的平织，门底留缝。": ["The door sweeps over the rug: pick a thin flat-weave, leave a gap under the door.", "문이 러그 위를 지나감: 얇은 평직을 고르고 문 아래 틈을 두세요."],
    "玄关小凳": ["Hall stool", "현관 스툴"], "⚠ 重叠：": ["⚠ Overlaps: ", "⚠ 겹침: "],
    "点一下餐桌或椅子就能拖动整套，吊灯跟着餐桌中心一起动。": ["Press the table or a chair to drag the whole set; the pendant moves with the table's centre.", "테이블이나 의자를 눌러 세트 전체를 이동; 조명은 테이블 중심을 따라 움직임."],
    "装饰": ["Decor", "장식"],
    "黑色拱门边几 40×40×45（一套三个叠放）": ["Black arch side tables 40×40×45 (a nesting set of three)", "검정 아치 사이드 테이블 40×40×45(3개 네스팅 세트)"],
    "选中的家具": ["Picked", "선택한 가구"], "尺寸（长×宽×高）": ["Size (L×W×H)", "크기(길이×폭×높이)"],
    "藤编躺椅": ["Cane lounger", "라탄 라운저"], "树瘤圆角茶几": ["Rounded burl coffee table", "버얼 라운드 커피 테이블"], "树瘤茶几": ["Burl coffee table", "버얼 커피 테이블"],
    "树瘤圆柱": ["Burl column", "버얼 원기둥"], "黑色拱门边几": ["Black arch side tables", "검정 아치 사이드 테이블"], "兰花瓶": ["Orchid vase", "난초 화병"], "散尾葵": ["Areca palm", "아레카 야자"],
    "水果盘": ["Fruit bowl", "과일 그릇"], "果盘 Φ30×7 cm": ["Fruit bowl Φ30×7 cm", "과일 그릇 Φ30×7 cm"],
    "古典台灯": ["Classic table lamp", "클래식 테이블 램프"], "转臂落地灯": ["Swing-arm floor lamp", "스윙암 플로어 램프"], "灯具": ["Lamps", "조명"],
    "台灯：灯罩 Φ35，高约 56 cm": ["Table lamp: shade Φ35, about 56 cm high", "테이블 램프: 갓 Φ35, 높이 약 56cm"], "落地灯：高 152 cm，转臂 70 cm，底盘 Φ26": ["Floor lamp: 152 cm high, 70 cm swing arm, base Φ26", "플로어 램프: 높이 152cm, 스윙암 70cm, 받침 Φ26"],
    "十八纸圆柱": ["Honeycomb-paper column", "허니콤 종이 원기둥"], "拱门边几": ["Arch side tables", "아치 사이드 테이블"], "白色": ["White", "흰색"],
    "卷扶手南洋藤椅": ["Scroll-arm planter chair", "스크롤 암 라탄 체어"],
    "黑陶罐台灯": ["Black ceramic jar lamp", "블랙 도자기 항아리 램프"], "台灯：灯罩 Φ30，高 40 cm（充电款）": ["Table lamp: shade Φ30, 40 cm high (rechargeable)", "테이블 램프: 갓 Φ30, 높이 40cm(충전식)"],
    "高枝条玻璃瓶": ["Tall branches in a glass vase", "유리 화병과 긴 가지"], "玻璃瓶 Φ25×40，鲜枝连瓶高约 0.9 m": ["Glass vase Φ25×40, about 0.9 m tall with the fresh branches", "유리 화병 Φ25×40, 생가지 포함 약 0.9m"],
    "利默椅 5 把（两边各 2 把，另一头 1 把）+ 宝宝椅在桌头。": ["Five Limo chairs (two each side, one at the other end) + the high chair at the head.", "리모 의자 5개(양쪽 2개씩, 반대쪽 끝 1개) + 아기 의자는 머리 쪽."],
    "利默椅 6 把（两边各 2 把，两头各 1 把），没有宝宝椅的位置。": ["Six Limo chairs (two each side, one at each end) - no room for the high chair.", "리모 의자 6개(양쪽 2개씩, 양 끝 1개씩) - 아기 의자 자리 없음."],
    "陶罐台灯": ["Ceramic jar lamp", "도자기 항아리 램프"], "陶瓷圆柱台灯": ["Ceramic column lamp", "도자기 원기둥 램프"],
    "台灯：陶瓷底座 Φ10×30，亚麻灯罩 Φ25，高 47 cm": ["Table lamp: ceramic base Φ10×30, linen shade Φ25, 47 cm high", "테이블 램프: 도자기 받침 Φ10×30, 린넨 갓 Φ25, 높이 47cm"],
    "粗针织盖毯（燕麦色）": ["Chunky-knit throw (oatmeal)", "청키 니트 담요(오트밀)"], "靠垫一对（橄榄绿、焦糖）": ["Pair of cushions (olive, caramel)", "쿠션 한 쌍(올리브, 캐러멜)"],
    "粗针织盖毯，叠成约 50×36 搭在沙发上": ["Chunky-knit throw, folded to about 50×36 on the sofa", "청키 니트 담요, 약 50×36으로 접어 소파 위에"], "靠垫两个，各 45×45：橄榄绿、焦糖色": ["Two cushions, 45×45 each: olive and caramel", "쿠션 2개, 각 45×45: 올리브, 캐러멜"],
    "窗帘": ["Curtains", "커튼"], "纱帘拉开": ["Sheer open", "시어 열기"], "纱帘拉上": ["Sheer drawn", "시어 닫기"], "亚麻窗帘": ["Linen curtains", "린넨 커튼"], "地毯": ["Rug", "러그"], "不铺": ["None", "없음"],
    "剑麻色平织": ["Sisal-colour flat weave", "사이잘색 평직"], "对面墙": ["Opposite wall", "맞은편 벽"], "绿色油画 120×90": ["Green oil painting 120×90", "녹색 유화 120×90"],
    "圆弧沙发 260": ["Crescent sofa 260", "곡선 소파 260"], "豌豆沙发 252": ["Pea sofa 252", "피 소파 252"], "柠檬黄": ["Lemon", "레몬"], "浅蓝": ["Light blue", "연한 파랑"], "浅蓝+条纹靠背": ["Light blue + striped backs", "연파랑 + 줄무늬 등받이"],
    "蓝白图案": ["Blue-and-white pattern", "청백 패턴"], "不用": ["None", "없음"], "用在坐垫": ["On the seat", "좌석에"], "用在靠背": ["On the backs", "등받이에"], "地毯和画": ["Rug and painting", "러그와 그림"],
    "剑麻色平织地毯 160×230": ["Sisal-colour flat-weave rug 160×230", "사이잘색 평직 러그 160×230"], "绿色油画 120×90，细深色框": ["Green oil painting 120×90, thin dark frame", "녹색 유화 120×90, 얇은 어두운 액자"],
    "豌豆沙发 252×119×72（商品表 135 深含两个金属托盘，已拿掉）": ["Pea sofa 252×119×72 (the listed 135 depth includes the two metal trays, left out)", "피 소파 252×119×72(목록의 깊이 135는 금속 트레이 2개 포함, 제외함)"],
    "已复制": ["Copied", "복사됨"], "复制下面这段发给 Claude：": ["Copy this and send it to Claude:", "이것을 복사해 Claude에게 보내세요:"],
    "把 Claude 给你的布局粘贴在这里：": ["Paste the layout Claude gave you here:", "Claude가 준 배치를 여기에 붙여넣기:"], "没看懂这段布局": ["Couldn't read that layout", "배치를 읽지 못했습니다"],
}
for k, (en, ko) in NEW.items():
    EN.setdefault(k, en); KO.setdefault(k, ko)
EN["收起"] = "Fold"; EN["展开"] = "Open"   # the free panel button (the page had them as blind words)
t = t[:m.start()] + "const EN = " + json.dumps(EN, ensure_ascii=False) + ";\n" + t[m.end():]
m2 = re.search(r"const KO = (\{.*?\});\n", t); t = t[:m2.start()] + "const KO = " + json.dumps(KO, ensure_ascii=False) + ";\n" + t[m2.end():]
body = t[:t.index("const EN = ")]
CJK = re.compile(r'[　-〿一-鿿＀-￯]')
miss = [x.strip() for x in re.findall(r"[^<>'\"`\n]+", body) if CJK.search(x) and x.strip() not in EN and x.strip() != '中文' and not x.strip().startswith('//')]
assert not miss, miss[:8]
io.open(S + "/c2-living-free.html", "w", encoding="utf-8").write(t); print("c2-living-free.html", len(t.encode("utf-8")))
