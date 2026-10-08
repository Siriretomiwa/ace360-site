"""Maple Lane Stories, Episode 1: "The New Girl Who Never Talked".

The whole episode as data: cast, camera shots and a timeline of steps.
build.py turns this into the two Roblox scripts plus a timing file for the edit.
"""
import math

TITLE = "Maple Lane Stories, Ep. 1: The New Girl Who Never Talked"
PI = math.pi

# name, skin, shirt, pants, hair style + colour, start position (x, z), yaw (0 faces -Z, pi faces +Z)
CAST = [
    dict(name="Mia", skin=(124, 84, 58), shirt=(186, 156, 240), pants=(44, 52, 96), sleeves=True,
         hair="puffs", hairColor=(42, 26, 16), x=48, z=24, yaw=PI / 2, color=(150, 110, 230)),
    dict(name="Jay", skin=(236, 186, 148), shirt=(242, 122, 58), pants=(62, 62, 70), sleeves=True,
         hair="short", hairColor=(96, 62, 30), x=-14, z=4.8, yaw=0, color=(235, 110, 40)),
    dict(name="Zoe", skin=(255, 214, 186), shirt=(255, 108, 164), pants=(236, 236, 244), sleeves=False,
         hair="ponytail", hairColor=(240, 200, 92), x=-17.5, z=3.6, yaw=-PI / 2, color=(230, 70, 140)),
    dict(name="Kai", skin=(160, 110, 80), shirt=(62, 150, 240), pants=(32, 32, 36), sleeves=False,
         hair="spiky", hairColor=(24, 24, 26), x=-10.5, z=3.6, yaw=PI / 2, color=(40, 120, 220)),
    dict(name="Principal", skin=(200, 150, 112), shirt=(52, 74, 62), pants=(40, 40, 44), sleeves=True,
         hair="short", hairColor=(160, 160, 160), x=-70, z=-40, yaw=PI, color=(40, 90, 70)),
    dict(name="Sam", skin=(250, 220, 190), shirt=(90, 190, 120), pants=(60, 60, 110), sleeves=False,
         hair="short", hairColor=(150, 80, 40), x=-28, z=-14, yaw=0.6, color=(60, 160, 90)),
    dict(name="Lily", skin=(110, 72, 50), shirt=(255, 210, 70), pants=(90, 60, 140), sleeves=False,
         hair="long", hairColor=(30, 20, 14), x=30, z=-10, yaw=-0.8, color=(220, 170, 30)),
]

# camera shots: (position, look-at)
SHOTS = {
    "wide": ((0, 22, 50), (0, 5, -8)),
    "enter_a": ((38, 7, 33), (44, 4.5, 21)),
    "enter_b": ((27, 7.5, 15), (18, 4, 1)),
    "gossip": ((-14, 6, 15), (-14, 4.3, 3.6)),
    "mia_alone": ((16, 6, 16), (16, 4.2, 2.6)),
    "jay_walk_a": ((-6, 6.5, 17), (-12, 4, 4)),
    "jay_walk_b": ((8, 7, 21), (16, 4, 9)),
    "mia_ots": ((15, 6.2, -1.2), (16.6, 4.8, 11.5)),
    "jay_ots": ((17.4, 6.6, 13.2), (16, 4.6, 2.4)),
    "mia_close": ((16.4, 5.3, 6.6), (16, 4.7, 2.4)),
    "sketch": ((16, 8.6, 5.6), (16, 3.6, 4.4)),
    "approach": ((8.4, 7.4, 6), (19.5, 4.4, 6)),
    "mural_wide": ((0, 10, 17), (0, 9.5, -29)),
    "crowd_back": ((0, 8.5, -5), (0, 8.5, -29)),
    "principal": ((-7.5, 5.8, -18), (-11, 4.6, -26)),
    "front": ((1, 5.8, -28), (0, 4.4, -20.5)),
    "mia_face": ((-0.8, 5.3, -24.8), (2, 4.7, -22)),
    "two_shot": ((3.5, 5.4, -26.8), (3.5, 4.5, -21.8)),
}


def say_time(text):
    return round(min(5.5, max(2.2, 1.5 + 0.055 * len(text))), 2)


def build_steps():
    S = []
    shot = lambda name, tween=0: S.append(["shot", *SHOTS[name], tween])
    say = lambda who, text: S.append(["say", who, text, say_time(text)])
    wait = lambda t: S.append(["wait", t])

    # --- cold open
    S.append(["card", "MAPLE LANE STORIES", "Episode 1", 2.6])
    S.append(["card", "The New Girl Who Never Talked", "", 2.8])
    shot("wide")
    S.append(["anim", "Sam", "dance", True])
    S.append(["fade", "in", 1.2])
    wait(2.4)

    # --- Mia arrives
    shot("enter_a")
    S.append(["walk", "Mia", [(17.5, 0.4)], 6.4])
    shot("enter_b", 6.4)
    wait(3.0)
    shot("gossip")
    S.append(["face", "Zoe", 25, 10])
    S.append(["face", "Kai", 25, 10])
    say("Zoe", "Who's the new girl?")
    say("Kai", "That's Mia. She hasn't said ONE word all day.")
    say("Zoe", "Wow. Rude much?")
    S.append(["sit", "Mia", "SeatMia"])
    S.append(["prop", "Sketchbook", True])
    shot("mia_alone")
    S.append(["face", "Zoe", -14, 4.8])
    S.append(["face", "Kai", -14, 4.8])
    wait(2.6)

    # --- Jay goes over
    shot("gossip")
    say("Jay", "Rude? Or maybe she's just new.")
    say("Zoe", "Whatever, Jay.")
    shot("jay_walk_a")
    S.append(["walk", "Jay", [(16.8, 12.8)], 6.0])
    shot("jay_walk_b", 5.6)
    wait(6.2)
    S.append(["face", "Jay", 16, 2.4])
    shot("mia_ots")
    say("Jay", "Hey... is this seat taken?")
    say("Mia", "(shakes her head)")
    S.append(["sit", "Jay", "SeatJay"])
    shot("jay_ots")
    say("Jay", "I'm Jay. Is that... a drawing?")
    say("Mia", "(slides the sketchbook over)")
    shot("sketch", 1.2)
    wait(2.6)
    shot("jay_ots")
    say("Jay", "Whoa. You drew THIS? It's our school!")
    # Zoe and Kai head over while Mia reacts (route goes round the table)
    S.append(["walk", "Zoe", [(22.6, 0.0), (22.6, 4.8)], 6.0])
    S.append(["walk", "Kai", [(23.8, -0.8), (23.0, 7.8)], 6.4])
    shot("mia_close")
    say("Mia", "(smiles for the first time today)")
    wait(1.6)
    shot("approach")
    wait(1.4)
    S.append(["face", "Zoe", 16, 4])
    S.append(["face", "Kai", 16, 7])
    say("Zoe", "Jay, why are you sitting with HER? She doesn't even talk.")
    say("Kai", "Yeah... it's kinda weird.")
    shot("jay_ots")
    say("Jay", "Maybe nobody ever gave her a reason to.")
    shot("mia_close")
    wait(1.4)

    # --- the announcement
    shot("mural_wide", 6.0)
    S.append(["announce", "PRINCIPAL GRANT",
              "Reminder! The school mural contest closes TODAY. The winning design gets painted on the courtyard wall!", 6.0])
    shot("approach")
    say("Kai", "Ha. Nobody ever enters that thing.")
    shot("jay_ots")
    say("Jay", "Mia... you should enter.")
    say("Mia", "(shakes her head)")
    say("Jay", "Come on. What's the worst that could happen?")
    shot("sketch", 1.0)
    wait(2.2)
    S.append(["fade", "out", 1.0])

    # --- later that day: the reveal
    S.append(["card", "LATER THAT DAY...", "", 2.2])
    S.append(["prop", "Sketchbook", False])
    for name, x, z, yaw in [("Mia", 2, -22, 0), ("Jay", 5, -21.5, 0), ("Zoe", -3, -21, 0), ("Kai", -6, -21.5, 0),
                            ("Sam", 9, -20.5, 0), ("Lily", -10, -20.5, 0), ("Principal", -11.5, -26, PI)]:
        S.append(["place", name, x, z, yaw])
    shot("crowd_back")
    S.append(["fade", "in", 1.0])
    wait(1.0)
    shot("principal")
    say("Principal", "Thank you all for waiting! This year we had exactly ONE entry...")
    shot("crowd_back")
    say("Kai", "Told you. Nobody enters.")
    shot("principal")
    say("Principal", "...and it is INCREDIBLE. Please welcome our new mural artist... MIA!")
    shot("mural_wide", 5.0)
    S.append(["mural"])
    for name in ("Jay", "Sam", "Lily"):
        S.append(["anim", name, "cheer", True])
    wait(5.0)
    shot("front")
    say("Jay", "MIA! That's YOUR drawing!")
    S.append(["stop", "Jay"])
    S.append(["walk", "Zoe", [(0.4, -22.4)], 1.4])
    wait(1.6)
    S.append(["face", "Zoe", 2, -22])
    S.append(["face", "Mia", 0.4, -22.4])
    say("Zoe", "Okay... that's actually amazing. Sorry I called you rude.")
    shot("mia_face")
    wait(0.8)
    say("Mia", "Thanks. I'm not rude... I'm just really shy.")
    shot("front")
    S.append(["anim", "Kai", "laugh", False])
    say("Kai", "WAIT. SHE TALKS?!")
    for name in ("Sam", "Lily", "Jay"):
        S.append(["anim", name, "laugh", False])
    wait(1.4)
    S.append(["face", "Mia", 5, -21.5])
    S.append(["face", "Jay", 2, -22])
    shot("two_shot")
    say("Jay", "Same table tomorrow?")
    say("Mia", "Same table tomorrow.")
    S.append(["anim", "Mia", "wave", False])
    wait(2.0)
    S.append(["fade", "out", 1.5])
    S.append(["card", "NEXT TIME", "Mia's First Sleepover", 3.0])
    S.append(["card", "SUBSCRIBE", "for Episode 2 of Maple Lane Stories!", 3.0])
    S.append(["end"])
    return S
