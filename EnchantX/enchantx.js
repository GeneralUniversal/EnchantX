mc.listen("onServerStarted", function() {
    let cmd = mc.newCommand("enchantx", "高级附魔", PermType.GameMasters)
    cmd.setCallback(function(cmd, origin, output, results) {
        try {

            let players = results.player
            if (Array.isArray(players)) {
                players.map(p => handleEnchantment(p, results, output))
            } else {
                handleEnchantment(players, results, output)
            }

        } catch (error) {
            return output.error(`§c出错了，请检查输入${error}`)
        }
    })
    cmd.setEnum("enchantmentName", Object.keys(Enchantments1))
    cmd.setEnum("remove", ["remove"])
    cmd.mandatory("player", ParamType.Player)
    cmd.optional("remove", ParamType.Enum, "remove")
    cmd.mandatory("enchantmentName", ParamType.Enum, "enchantmentName")
    cmd.optional("level", ParamType.Int)
    cmd.mandatory("enchantmentId", ParamType.Int)
    cmd.overload(["player", "enchantmentName", "level"]);
    cmd.overload(["player", "enchantmentId", "level"]);
    cmd.overload(["player", "remove", "enchantmentId"]);
    cmd.overload(["player", "remove", "enchantmentName"]);
    cmd.setup()
})

/**
 * 处理附魔的主要函数
 * @param {Player} player - 玩家对象
 * @param {Object} results - 命令结果对象
 * @param {CommandOutput} output - 命令输出对象
 */
function handleEnchantment(player, results, output) {
    if (!player) {
        return output.error("请对玩家执行此命令")
    }
    let i = player.getHand().getNbt()
    let id
    if (results.enchantmentName){
        id=getEnchantmentId(results.enchantmentName)
    }
    else if (results.enchantmentId){
        id=results.enchantmentId
    }
    else{
        return output.error("请输入正确的附魔名称或ID")
    }

    if (id < 0 || id > 41) return output.error(`§c没有 ID 为 ${id} 的魔咒`)
    let level = results.level
    // 原有的添加附魔逻辑
    if (level===undefined){
        level=1
    }
    // 确保tag和ench存在
    if (!i.getTag("tag")) {
        i.setTag("tag", new NbtCompound())
    }
    if (!i.getTag("tag").getTag("ench")) {
        i.getTag("tag").setTag("ench", new NbtList())
    }
    // 处理remove命令
    if (results.remove === "remove") {


        let enchList = i.getTag("tag").getTag("ench")
        let removed = false

        // 直接在原列表中删除匹配的附魔
        for (let index = enchList.getSize() - 1; index >= 0; index--) {
            let enchantment = enchList.getTag(index)
            if (enchantment.getData("id") === id) {
                enchList.removeTag(index)
                removed = true
                break
            }
        }

        if (removed) {
            player.getHand().setNbt(i)
            player.refreshItems()
            return output.success(`成功移除 ${player.name} 物品上的 ${getEnchantmentName(id)} 附魔`)
        } else {
            return output.error(`物品上没有找到 ${getEnchantmentName(id)} 附魔`)
        }
    }





    let enchList = i.getTag("tag").getTag("ench")
    let found = false

    // 查找是否已存在相同ID的附魔
    for (let index = 0; index < enchList.getSize(); index++) {
        let enchantment = enchList.getTag(index)


        if (enchantment.getData("id")===null) continue
        if (enchantment.getData("id") === id) {
            // 覆盖已存在的附魔等级
            enchantment.setShort("lvl", level)
            found = true
            break
        }
    }
    // 如果没有找到相同ID的附魔，则添加新的
    if (!found) {
        enchList.addTag(new NbtCompound().setShort("id", id).setShort("lvl", level))
    }

    player.getHand().setNbt(i)
    player.refreshItems()
    return output.success(`成功给 ${player.name} 添加 ${getEnchantmentName(id)} 的 ${level} 级的附魔`)
}

function getEnchantmentName(id) {
    const Enchantments = {
        0: "protection",
        1: "fire_protection",
        2: "feather_falling",
        3: "blast_protection",
        4: "projectile_protection",
        5: "thorns",
        6: "respiration",
        7: "depth_strider",
        8: "aqua_affinity",
        9: "sharpness",
        10: "smite",
        11: "bane_of_arthropods",
        12: "knockback",
        13: "fire_aspect",
        14: "looting",
        15: "efficiency",
        16: "silk_touch",
        17: "unbreaking",
        18: "fortune",
        19: "power",
        20: "punch",
        21: "flame",
        22: "infinity",
        23: "luck_of_the_sea",
        24: "lure",
        25: "frost_walker",
        26: "mending",
        27: "binding",
        28: "vanishing",
        29: "impaling",
        30: "riptide",
        31: "loyalty",
        32: "channeling",
        33: "multishot",
        34: "piercing",
        35: "quick_charge",
        36: "soul_speed",
        37: "swift_sneak",
        38: "wind_burst",
        39: "density",
        40: "breach",
        41: "lunge"
    };
    return Enchantments[id];
}

const Enchantments1 = {
    "protection": 0,
    "fire_protection": 1,
    "feather_falling": 2,
    "blast_protection": 3,
    "projectile_protection": 4,
    "thorns": 5,
    "respiration": 6,
    "depth_strider": 7,
    "aqua_affinity": 8,
    "sharpness": 9,
    "smite": 10,
    "bane_of_arthropods": 11,
    "knockback": 12,
    "fire_aspect": 13,
    "looting": 14,
    "efficiency": 15,
    "silk_touch": 16,
    "unbreaking": 17,
    "fortune": 18,
    "power": 19,
    "punch": 20,
    "flame": 21,
    "infinity": 22,
    "luck_of_the_sea": 23,
    "lure": 24,
    "frost_walker": 25,
    "mending": 26,
    "binding": 27,
    "vanishing": 28,
    "impaling": 29,
    "riptide": 30,
    "loyalty": 31,
    "channeling": 32,
    "multishot": 33,
    "piercing": 34,
    "quick_charge": 35,
    "soul_speed": 36,
    "swift_sneak": 37,
    "wind_burst": 38,
    "density": 39,
    "breach": 40,
    "lunge": 41
};

/**
 * 根据附魔名称获取附魔ID
 * @param {string} name - 附魔英文名称
 * @returns {number|undefined} 附魔ID
 */
function getEnchantmentId(name) {
    return Enchantments1[name];
}
