// 大体このくらい1フレームに消費されると考えることにするぞ！
const FRAME_INTERVAL = 30;

// キーイベントを発火するぞ！
function fireKeyEvent(key) {
	if (key == null) return;
	// すぐ押す
	document.dispatchEvent(new KeyboardEvent("keydown", { key: key }));
	// しばらくしたらはなす
	// たぶん呼び出されまくるとバグる。やめてね
	setTimeout(() => document.dispatchEvent(new KeyboardEvent("keyup", { key: key })), FRAME_INTERVAL);
}

let stopAI = false; // 緊急停止！
let stuckCount = 0; // 詰んでそうメーター

// キーを表す定数
const LEFT = "a";
const UP = "w";
const RIGHT = "d";
const DOWN = "s";
const OK = "Enter";
const CANCEL = "Shift";
const WAIT = null;

const PHASE_TITLE = "タイトル";
const PHASE_STAGE_SELECT = "ステージ選択";
const PHASE_CHALLENGE = "挑戦";
const PHASE_SHOP = "お店";
const PHASE_EDIT = "デッキ編集";
const PHASE_BATTLE = "戦闘";

function getPhase() {
	return game_phase;
}

const DUEL_FREE = "自由"; // なんかしようという気持ち
const DUEL_ENEMY = "相手"; // 相手のターン中はすることがないぞ！
const DUEL_ATTACK = "攻撃"; // 攻撃する相手のモンスターを選ぶぜ！
const DUEL_SUMMON = "召喚"; // 自分のモンスターを召喚する場所を選ぶぜ！
const DUEL_CONFIRM_TURN_END = "ターンエンド確認";
const DUEL_CONFIRM_MAGIC_CAST = "魔法発動確認";
const DUEL_ENEMY_MAGIC_CAST = "相手発動確認";
const DUEL_CONFIRM_SURRENDER = "降参";
const DUEL_CHOOSE_ENEMY = "敵選択"; // 攻撃以外のカードの効果で相手カードが選ばれるときに使われるぜ！
const DUEL_CHOOSE_ALLY = "味方選択"; // 回復とかじゃないかな…
const DUEL_WIN = "俺勝ち";
const DUEL_LOSE = "敵勝ち";

function getDuelPhase() {
	return duel_phase == DUEL_ENEMY && aite_phase == DUEL_ENEMY_MAGIC_CAST ? aite_phase : duel_phase;
}

const CARD_SYUUKUN = "しゅうくん";
const CARD_HOJOROBO = "補助ロボ";
const CARD_KINKYUUJITAI5 = "緊急事態─５─";
const CARD_RYUUNOITIGEKI = "龍の一撃";
const CARD_POWERUP3 = "パワーアップ３";
const CARD_HPUP5 = "体力アップ5";
const CARD_PONYA = "ぽにゃ";
const CARD_PONYA_ACE = "ぽにゃエース";
const CARD_YAKUSO_3 = "薬草3";
const CARD_KAMEISI = "亀石";
const CARD_KAMETETU = "亀鉄";
const CARD_HENYAMOTIN = "へにゃもちん";
const CARD_PONYA_SUTORAIKU = "ぽにゃストライク";
const CARD_PONYA_BIG = "ぽにゃBIG";
const CARD_PONYA_DABURU = "ぽにゃダブル";
const CARD_PONYA_REIN = "ぽにゃレイン！";
const CARD_SASORI = "サソリ";
const CARD_SASORI_SEITAI = "サソリ_成体";
const CARD_IKKAKUDAIJA_ATAMA = "一角大蛇の頭";
const CARD_IKKAKUDAIJA_HARA = "一角大蛇の腹";
const CARD_IKKAKUDAIJA_YUBI = "一角大蛇の指";
const CARD_KYUUKOUKASAKUSENKI = "急降下作戦機";
const CARD_ATAKKUMOJURU = "アタックモジュール";
const CARD_KAIHUKUMOJURU = "回復モジュール";
const CARD_SUKURAPPUDORO = "スクラップ・ドロー";
const CARD_BUIWA = "ブ・岩";
const CARD_RAIHUDAIYA = "ライフダイヤ";
const CARD_SEIRETU = "整列！";
const CARD_KYUUSAINOTE = "救済の手";
const CARD_KENROUNARUSOUKOU = "堅牢なる装甲";
const CARD_ZETTAINOTAMASII = "絶対の魂";
const CARD_KYOUSINJA = "狂信者";
const CARD_HAMETUNOKAMI = "破滅の神";

// 押すべきキーのキュー
const queue = [];

function press(key) {
	queue.push(key); // あとでおしてね
}

// いろいろやる
function update() {
	if (queue.length == 0) {
		// 次の入力をもらう
		if (!stopAI) {
			main();
		}
	}
	if (queue.length > 0) {
		// 先頭の入力を処理するぞ！
		fireKeyEvent(queue.shift());
	}
}

// 押してから離すのを認識するまでには2フレームかかるらしい・・・えーっ！？
setInterval(update, FRAME_INTERVAL * 2);

function main() {
	// ここで次の動きを決めるよ
	switch (getPhase()) {
		case PHASE_STAGE_SELECT:
			// ステージ2をえらんでね
			selectStage(2);
			break;
		case PHASE_CHALLENGE:
			// じゅんじるが連打すると死ぬバグを仕込んだ！こっちもハックで対応だ！おー！
			press(OK);
			press(WAIT);
			press(WAIT);
			break;
		case PHASE_BATTLE:
			// たたかえ　しぬまで
			battle();
			break;
	}
}

const CURSOR_PREV_STAGE = 0;
const CURSOR_CHOOSE_STAGE = 3;
const CURSOR_EDIT_DECK = 2;

function selectStage(stageIndex) {
	if (stage != stageIndex) {
		if (cursor != CURSOR_PREV_STAGE) {
			press(LEFT);
			press(UP);
			return;
		}
		press(OK);
		return;
	}
	if (cursor != CURSOR_EDIT_DECK) {
		press(LEFT);
		press(DOWN);
		return;
	}
	press(RIGHT);
	press(OK);
}

const CURSOR_TURN_END = -1;
const CURSOR_PLAYER_FIELD_MIN = 6;
const CURSOR_PLAYER_FIELD_MAX = 10;
const CURSOR_ENEMY_FIELD_MIN = 11;
const CURSOR_ENEMY_FIELD_MAX = 15;

function getPlayerHands() {
	return my_tehuda.map(getCardInfo);
}

function getBaseCardInfo(rawBaseCard) {
	return {
		name: rawBaseCard.name,
		atk: rawBaseCard.ATK,
		hp: rawBaseCard.HP,
	};
}

function getCardInfo(rawCard) {
	return {
		card: getBaseCardInfo(rawCard.card),
		atk: rawCard.ATK,
		hp: rawCard.HP,
		attackCount: rawCard.can_ATK,
	};
}

function getPlayerField() {
	return getFieldInfo(my_ba);
}

function getEnemyField() {
	return getFieldInfo(teki_ba);
}

function getFieldInfo(rawField) {
	const cards = [];
	for (let i = 0; i < 5; i++) {
		cards.push(rawField[i] == "" ? null : getCardInfo(rawField[i]));
	}
	return {
		cards: cards,
		forEach: function (callbackIndexCard) {
			for (let i = 0; i < 5; i++) {
				if (cards[i] != null) {
					callbackIndexCard(i, cards[i]);
				}
			}
		},
		numCards: function () {
			let count = 0;
			for (let i = 0; i < 5; i++) {
				if (cards[i] != null) {
					count++;
				}
			}
			return count;
		},
	};
}

function moveCursorToPlayerHand(handIndex) {
	press(UP);
	for (let i = 0; i < handIndex; i++) {
		press(RIGHT);
	}
}

function moveCursorToPlayerMonster(monsterIndex) {
	press(DOWN);
	for (let i = 0; i < monsterIndex; i++) {
		press(DOWN);
	}
}

function battle() {
	switch (getDuelPhase()) {
		case DUEL_ENEMY:
			stuckCount = 0; // 詰んでない
			break;
		case DUEL_WIN:
		case DUEL_LOSE:
			// 勝敗なんか関係ねえんだよ
			press(OK);
			press(WAIT);
			press(WAIT);
			break;
		case DUEL_ENEMY_MAGIC_CAST:
			// あっそう……
			press(OK);
			break;
		case DUEL_FREE:
			if (cursor != CURSOR_TURN_END) {
				// カーソルの位置をリセットして操作しやすくしよう
				if (cursor >= CURSOR_PLAYER_FIELD_MIN && cursor <= CURSOR_PLAYER_FIELD_MAX) {
					press(UP); // プレイヤーのフィールド上にあるっぽい
				} else if (cursor >= CURSOR_ENEMY_FIELD_MIN && cursor <= CURSOR_ENEMY_FIELD_MAX) {
					press(LEFT); // 敵のフィールド上にあるっぽい
				} else if (cursor < CURSOR_PLAYER_FIELD_MIN) {
					press(LEFT); // なんか一番上の列？にありそう
				} else {
					press(UP); // 手札かな？
				}
				break;
			}
			const hands = getPlayerHands();
			let monsterIndex = -1;
			let magicIndex = -1;
			let magicCount = 0;
			for (let i = 0; i < hands.length; i++) {
				const hand = hands[i];
				if (hand.card.name == CARD_PONYA_BIG) {
					if (monsterIndex == -1) monsterIndex = i;
				}
				if (hand.card.name == CARD_PONYA_REIN) {
					if (magicIndex == -1) magicIndex = i;
					magicCount++;
				}
			}
			const pfield = getPlayerField();
			const efield = getEnemyField();
			const monsterCount = pfield.numCards();

			if (monsterCount < 5 && monsterIndex != -1) {
				// ぽにゃを召喚しよう
				moveCursorToPlayerHand(monsterIndex);
				press(OK);
				press(OK);
				break;
			}

			const monsterCountThreshold = magicCount >= 3 ? 2 : 3;
			if (monsterCount >= monsterCountThreshold && magicIndex != -1 && efield.numCards() > 0) {
				// ぽにゃレインを発動しよう
				moveCursorToPlayerHand(magicIndex);
				press(OK);
				press(OK);
				break;
			}

			let attackableIndex = -1;
			pfield.forEach((i, hand) => {
				if (hand.attackCount > 0 && attackableIndex == -1) {
					attackableIndex = i;
				}
			});
			if (attackableIndex != -1) {
				// なんでもいいから攻撃しろ
				moveCursorToPlayerMonster(attackableIndex);
				press(OK);
				press(OK);
				break;
			}

			// やることがなくなったらターンエンドしとこ
			press(OK);
			press(OK);

			break;
		default:
			stuckCount++;
			if (stuckCount > 10) {
				press(OK); // よく分からんけど押してみるか
				stuckCount = 0; // 押したよ
			}
			break;
	}
}
