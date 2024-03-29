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

const CARD_TEST_CARD = "テストカード";
const CARD_TEST_CARD2 = "テストカード2";
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
const CARD_BURAKKUSYUUKUN = "ブラックしゅうくん";
const CARD_HOJOSEKI = "補助石";
const CARD_MUSYOUNOAI = "無償の愛";
const CARD_NITOURYUUKENGI = "二刀流剣技！";
const CARD_SINENNOAI = "深淵の愛";
const CARD_TYOUBUSOU = "超武装！";
const CARD_YAMIRYUUSYUU = "闇龍　シュウ";
const CARD_YAMIKA = "闇化";
const CARD_DORAGONBURESU = "ドラゴン・ブレス";
const CARD_ZEROZONBIZU = "ZEROゾンビs";
const CARD_PONYAAIDORU = "ぽにゃアイドル♪";
const CARD_AIDORUKOURIN = "アイドル降臨！";
const CARD_HAMETUNOSINKOU = "破滅の信仰";
const CARD_SENTANSEISEI = "先端再生";
const CARD_IKKAKUDAIJA_2 = "双頭の一角大蛇";
const CARD_ITTOURYOUDAN = "一刀両断";
const CARD_PONYASYOUKANSI = "ぽにゃ召喚士";
const CARD_ZOUSYOKU = "増殖…！？";
const CARD_SUKURAPPUGOREMU = "スクラップゴーレム";
const CARD_SUKURAPPUBIRUDO = "スクラップ&ビルド";
const CARD_SASORI_HUJOU = "サソリ_不浄";
const CARD_DOKUHAKINOKO = "毒吐キノコ";
const CARD_KARAMARUITO = "絡まる糸";
const CARD_OOKAMETAKE = "大亀茸";
const CARD_MOUKYODOKUDAITAKE = "猛巨毒大茸";
const CARD_ROZUSYUU = "ローズ・シュウ";
const CARD_KANBANSAN = "看板さん";
const CARD_GURUMESINJIDAI = "グルメ新時代";
const CARD_KINKYUUJITAI3 = "緊急事態─３─";
const CARD_MIRYOUSURUHITOMI = "魅了する瞳";
const CARD_KANKYOUSEIHAGOREMU = "環境制覇ゴーレム";
const CARD_DOKUZOMENAIHU = "毒染めナイフ";
const CARD_TIZOMENAIHU = "血染めナイフ";
const CARD_MUZOMENAIHU = "無染めナイフ";
const CARD_NAIHUZOMEOTOKO = "ナイフ染め男";
const CARD_SABITAYARI = "錆びた槍";
const CARD_KANTUUYA = "貫通矢";
const CARD_SABITATAIKEN = "錆びた大剣";
const CARD_UEPONSARUBEJI = "ウエポン・サルベージ";
const CARD_HOKAKUSUNEKU = "捕獲スネーク";
const CARD_ISSEIHOKAKU = "一斉捕獲";
const CARD_AOONI = "青鬼";
const CARD_AKAONI = "赤鬼";
const CARD_SUNATTIDORAGON = "盗竜　スナッチドラゴン";
const CARD_TOURYUUZANNOSIREN = "盗竜山の試練";
const CARD_RYUUKON = "龍魂";
const CARD_IKARIBAKUHATU = "怒り爆発！";
const CARD_NEZUMI = "ねずみ";
const CARD_TYUUNEZUMI = "中ねずみ";
const CARD_DEKANEZUMI = "デカねずみ";
const CARD_DOKUNEZUMI = "毒ねずみ";
const CARD_TAMANEZUMI = "玉ねずみ";
const CARD_TATUJINNEZUMI = "達人ねずみ";
const CARD_KYUUSONEKOWOKAMU = "窮鼠猫を嚙む";
const CARD_TAMANORINEZUMI = "玉乗りねずみ";
const CARD_TAMANORIDOKUNEZUMI = "玉乗り毒ねずみ";
const CARD_TAMANORI = "玉乗り";
const CARD_TYUUKUN = "ちゅーくん";
const CARD_MOTINREDDO = "もちん・レッド";
const CARD_MOTINBURUU = "もちん・ブルー";
const CARD_MOTINGURIN = "もちん・グリーン";
const CARD_MOTINPINKU = "もちん・ピンク";
const CARD_MOTINIERO = "もちん・イエロー";
const CARD_HIROBAKUTAN = "ヒーロー爆誕！";
const CARD_MOTINKOSUMO = "もちん・コスモ";
const CARD_GINGAPAWA = "銀河☆パワー！";
const CARD_MOTINBURAKKU = "もちん・ダーク";
const CARD_YAMIYONOKAGE = "闇夜の影";
const CARD_OU = "王";
const CARD_EKKEN = "謁見";
const CARD_BUPPINHANBAI = "物品販売";
const CARD_KAMEKO = "亀子";
const CARD_SASORI_MUSUME = "サソリ_娘";
const CARD_OPEROBO = "オペレーションロボット";
const CARD_DAIJANOTUKAI = "大蛇の使い";
const CARD_SOURUGADONA = "ソウル・ガードナー";
const CARD_HAMETUWOMATUMONO = "破滅を待つ者";
const CARD_ZEROZEROZERO = "ゼロ、ゼロ！ゼロォ！！";
const CARD_PUPUKURAUDO = "ぷーぷーくらうど";
const CARD_PANTINGUKURAUDO = "ぱんちんぐくらうど";
const CARD_HAPPISUKORU = "ハッピー❤スコール";
const CARD_HITUJIKURAUDO = "ひつじくらうど";
const CARD_DABURUKURAUDO = "だぶるくらうど";
const CARD_HIKOUKIGUMO = "ひこうきぐも";
const CARD_AMAKURAUDO = "あまくらうど";
const CARD_POIZUNKURAUDO = "ぽいずんくらうど";
const CARD_BIRIBIRIKURAUDO = "びりびりくらうど";
const CARD_ENJERUKURAUDO = "えんじぇるくらうど";
const CARD_KURAUDO = "クラウド";
const CARD_DETAAPPURODO = "↑データアップロード↑";
const CARD_TAIHUU0GOU = "台風0号";

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

const targetState = 7;
const clearMiniStageValue = 1; // でゆっちがさいあくなのでステージによって変わります

// デッキは破滅の神とドラゴンブレスと超強化と闇化がいい感じに混ざるようにしといてね

function main() {
	// ここで次の動きを決めるよ
	switch (getPhase()) {
		case PHASE_STAGE_SELECT:
			// ステージをえらんでね
			selectStage(targetState);
			break;
		case PHASE_CHALLENGE:
			if (mini_stage == clearMiniStageValue) {
				if (cursor2 != 0) {
					press(LEFT); // ツイートしないでね
				}
			}
			// じゅんじるが連打すると死ぬバグを仕込んだ！こっちもハックで対応だ！おー！
			initBattle();
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

// カードの種類ごとに与えられるデータ
class CardBase {
	/**
	 * @param {string} name
	 * @param {number} atk
	 * @param {number} hp
	 */
	constructor(name, atk, hp) {
		this.name = name;
		this.atk = atk;
		this.hp = hp;
	}
}

// 個別のカードごとに与えられるデータ
class Card {
	/**
	 * @param {CardBase} base
	 * @param {number} atk
	 * @param {number} hp
	 * @param {number} attackCount
	 * @param {string[]} states
	 */
	constructor(base, atk, hp, attackCount, states) {
		this.base = base;
		this.atk = atk;
		this.hp = hp;
		this.attackCount = attackCount;
		this.states = states;
	}

	isAce(includeTopAce = true) {
		return this.states.indexOf("ACE") != -1 || (includeTopAce && this.states.indexOf("TOP_ACE") != -1);
	}
}

// カードの配列。手札かフィールド。フィールドの場合は空き場所に null が入るぞ！
class CardArray {
	/**
	 * @param {(Card | null)[]} cards
	 */
	constructor(cards) {
		this.cards = cards;
	}

	/**
	 * @param {string | null} name
	 */
	indexOf(name) {
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			if ((card == null && name == null) || (card != null && card.base.name == name)) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * @param {string | null} name
	 */
	count(name) {
		let count = 0;
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			if ((card == null && name == null) || (card != null && card.base.name == name)) {
				count++;
			}
		}
		return count;
	}

	countNonNull() {
		let count = 0;
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			if (card != null) {
				count++;
			}
		}
		return count;
	}

	/**
	 * @param {(index:number, card:Card) => void} f
	 */
	forEachNonNull(f) {
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			if (card != null) {
				f(i, card);
			}
		}
	}

	/**
	 * @param {string | null} name
	 * @param {(index:number, card:Card) => void} f
	 */
	forEach(name, f) {
		for (let i = 0; i < this.cards.length; i++) {
			const card = this.cards[i];
			if ((card == null && name == null) || (card != null && card.base.name == name)) {
				f(i, card);
			}
		}
	}
}

// 手札を返すぞ！
function getPlayerHands() {
	return new CardArray(my_tehuda.map(makeCard));
}

// カードの基礎情報を返すぞ！
function makeCardBase(rawCardBase) {
	return new CardBase(rawCardBase.name, rawCardBase.atk, rawCardBase.hp);
}

// カードの情報を返すぞ！
function makeCard(rawCard) {
	return new Card(makeCardBase(rawCard.card), rawCard.ATK, rawCard.HP, rawCard.can_ATK, rawCard.state);
}

function getPlayerField() {
	return getFieldInfo(my_ba);
}

function getEnemyField() {
	return getFieldInfo(teki_ba);
}

// フィールド情報を返すぞ！
function getFieldInfo(rawField) {
	const cards = [];
	for (let i = 0; i < 5; i++) {
		cards.push(rawField[i] == "" ? null : makeCard(rawField[i]));
	}
	return new CardArray(cards);
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

function moveToTopPlace() {
	let minPos = 5;
	let maxPos = -1;
	getPlayerField().forEachNull((i) => {
		minPos = Math.min(minPos, i);
		maxPos = Math.max(maxPos, i);
	});
	for (let i = 0; i < maxPos - minPos; i++) {
		press(UP);
	}
}

let dragonKilled = false;
function initBattle() {
	dragonKilled = false;
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
			const pfield = getPlayerField();
			const efield = getEnemyField();

			const numHametsu = hands.count(CARD_HAMETUNOKAMI);
			const numBusou = hands.count(CARD_TYOUBUSOU);
			const numBreath = hands.count(CARD_DORAGONBURESU);
			const numYamika = hands.count(CARD_YAMIKA);

			const numFieldHametsu = pfield.count(CARD_HAMETUNOKAMI);
			const numFieldYami = pfield.count(CARD_YAMIRYUUSYUU);

			if (pfield.countNonNull() == 0) {
				// 自分のフィールドに誰もいないっぽいぞ！
				if (numHametsu > 0) {
					// 破滅の神が召喚可能
					moveCursorToPlayerHand(hands.indexOf(CARD_HAMETUNOKAMI));
					press(OK);
					press(OK);
					break;
				}
			} else if (numFieldHametsu > 0) {
				// 自分のフィールドに破滅の神がいるっぽいぞ！
				let attackableHametsuIndex = -1;
				pfield.forEach(CARD_HAMETUNOKAMI, (i, card) => {
					if (attackableHametsuIndex == -1 && card.attackCount > 0) {
						attackableHametsuIndex = i;
					}
				});
				if (attackableHametsuIndex != -1) {
					// 攻撃できるやつがいる
					if (efield.countNonNull() > 0) {
						// 敵がいるらしいのでとりあえず殴っとくか
						moveCursorToPlayerMonster(attackableHametsuIndex);
						press(OK);
						press(OK);
						break;
					}
				}
				if (numYamika > 0) {
					// 闇化可能
					moveCursorToPlayerHand(hands.indexOf(CARD_YAMIKA));
					// あ～あ、知らないんだから！
					press(OK);
					press(OK);
					break;
				}
				if (attackableHametsuIndex != -1) {
					if (efield.countNonNull() == 0) {
						// ダイレクトアタックチャンス！！！！！！
						if (numBusou > 0) {
							// 強くしてから殴った方がいいよね
							moveCursorToPlayerHand(hands.indexOf(CARD_TYOUBUSOU));
							press(OK);
							press(OK);
							break;
						}
						// ぐえー
						moveCursorToPlayerMonster(attackableHametsuIndex);
						press(OK);
						press(OK);
						break;
					}
				}
			} else if (numFieldYami > 0) {
				// 闇龍・シュウがおるな
				let attackableYamiIndex = -1;
				pfield.forEach(CARD_YAMIRYUUSYUU, (i, card) => {
					if (attackableYamiIndex == -1 && card.attackCount > 0) {
						attackableYamiIndex = i;
					}
				});
				if (attackableYamiIndex != -1 && efield.countNonNull() > 0 && numBreath > 0) {
					// 敵がいて、ドラゴンブレスがある・・・あっ（察し）
					if (hands.count(CARD_YAMIKA) > 0 || hands.count(CARD_HAMETUNOKAMI) > 0) {
						// さらに、闇化か破滅の神がいる
						// 行けるぞ！ドラゴンブレス発動！！！！！！！！！！１
						moveCursorToPlayerHand(hands.indexOf(CARD_DORAGONBURESU));
						press(OK);
						press(OK);
						break;
					} else {
						// ちょっと足りなそう。
					}
				}
				if (efield.countNonNull() == 0) {
					// 敵がおらん
					if (attackableYamiIndex != -1) {
						// ダイレクトアタックチャンス！！！！！！
						if (numBusou > 0) {
							// 強くしてから殴った方がいいよね
							moveCursorToPlayerHand(hands.indexOf(CARD_TYOUBUSOU));
							press(OK);
							press(OK);
							break;
						}
						// ぐえー
						moveCursorToPlayerMonster(attackableYamiIndex);
						press(OK);
						press(OK);
						break;
					} else {
						// もう攻撃できない？なんだと！
						if (hands.count(CARD_YAMIKA) > 0) {
							// もう一回闇化すればいいぢゃん（笑）
							moveCursorToPlayerHand(hands.indexOf(CARD_YAMIKA));
							press(OK);
							press(OK);
							break;
						} else if (numHametsu > 0) {
							// う～んしょうがない破滅の神で殴るか
							moveCursorToPlayerHand(hands.indexOf(CARD_HAMETUNOKAMI));
							press(OK);
							press(OK);
							break;
						}
					}
				} else {
					// 敵がおる
					if (attackableYamiIndex != -1) {
						// まあいいやとりあえず殴っとこ
						moveCursorToPlayerMonster(attackableYamiIndex);
						press(OK);
						press(OK);
						break;
					}
				}
			}
			
			// やることねーなー
			let sumHp = 0;
			pfield.forEachNonNull((i, card) => {
				sumHp += card.hp;
			});
			if (sumHp < 30) {
				// ワンチャン死にそうじゃない？追加でカードだしとこ
				if (numHametsu > 0) {
					moveCursorToPlayerHand(hands.indexOf(CARD_HAMETUNOKAMI));
					press(OK);
					press(OK);
					break;
				}
			}

			// let monsterIndex = hands.indexOf(CARD_HAMETUNOKAMI);
			// let magicIndex = hands.indexOf(CARD_KINKYUUJITAI5);
			// let magicCount = hands.count(CARD_KINKYUUJITAI5);
			// const monsterCount = pfield.countNonNull();
			// let enemyDragonCount = 0;
			// let enemyDragonAceCount = 0;
			// efield.forEachNonNull((i, card) => {
			// 	if (card.base.name == CARD_YAMIRYUUSYUU) {
			// 		if (card.isAce()) {
			// 			// ACE だったら？いや～キツいっす
			// 			enemyDragonAceCount++;
			// 		} else {
			// 			// ぶっころす
			// 			enemyDragonCount++;
			// 		}
			// 	}
			// });

			// if (monsterCount < 5 && monsterIndex != -1) {
			// 	// 破滅の神を召喚しよう
			// 	moveCursorToPlayerHand(monsterIndex);
			// 	press(OK);
			// 	moveToTopPlace();
			// 	press(OK);
			// 	break;
			// }

			// if (enemyDragonAceCount > 0) {
			// 	// 勝てんｗ
			// 	press(CANCEL);
			// 	press(UP);
			// 	press(OK);
			// 	break;
			// }

			// if (enemyDragonCount > 0 && magicIndex != -1) {
			// 	// 緊急事態を発動しよう
			// 	moveCursorToPlayerHand(magicIndex);
			// 	press(OK);
			// 	press(OK);
			// 	dragonKilled = true;
			// 	break;
			// }

			// let attackableIndex = -1;
			// pfield.forEachNonNull((i, hand) => {
			// 	if (hand.attackCount > 0 && attackableIndex == -1) {
			// 		attackableIndex = i;
			// 	}
			// });
			// if (attackableIndex != -1 && !dragonKilled) {
			// 	// なんでもいいから攻撃しろ
			// 	moveCursorToPlayerMonster(attackableIndex);
			// 	press(OK);
			// 	press(OK);
			// 	break;
			// }

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
