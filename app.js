/* VEAF squadron site. Reads data.json (written by VEAF Command › Settings ›
   Website) and renders every page from it. No build step, no libraries. */
(function () {
  "use strict";

  var DISCORD = "http://dsc.gg/veaf";
  var DATA = null;
  var LANG = "en";
  try { LANG = localStorage.getItem("veaf-lang") || (navigator.language || "").slice(0, 2) === "ar" && "ar" || "en"; } catch (e) { LANG = "en"; }
  if (LANG !== "ar") LANG = "en";

  /* ------------------------------------------------------------- strings */
  var T = {
    en: {
      ops_eyebrow: "Operations", ops_h: "Operations", ops_intro: "Upcoming briefs and every debriefed operation, with results for each pilot and the full debrief report.",
      upcoming_h: "Upcoming briefs", debriefed_h: "Debriefed operations", no_upcoming: "No operation is planned yet. Briefs appear here as soon as they are scheduled.",
      no_ops: "No operations match.", all_types: "All types", search_ops: "Search operation or pilot", signed_up: "signed up", reserves: "Reserves", nobody_yet: "Nobody yet.",
      c_report: "Report", open_report: "Open", open_full_report: "Open the full debrief report", back_ops: "← All operations", op_not_found: "That operation is not on the site.",
      debriefed_by: "debriefed by", brief_h: "Brief", card_h: "Mission card", teams_h: "Flights", debrief_h: "Debrief", lessons_h: "Lessons learned", results_h: "Results",
      c_ff: "Friendly", c_deaths: "Deaths", c_minutes: "Minutes", c_notes: "Notes",
      k_time: "Mission time", k_step: "Step", k_takeoff: "Takeoff", k_tot: "Time on target", k_rtb: "RTB", k_dep: "Departure runway", k_arr: "Arrival runway", k_altn: "Alternate",
      k_bulls: "Bullseye", k_tacan: "TACAN", k_laser: "Laser code", k_iff: "IFF", k_joker: "Joker", k_bingo: "Bingo", k_datalink: "Datalink", k_loadout: "Loadout",
      sq_standings: "Squadron standings", pilots_word: "pilots", sorties_word: "sorties", no_squadron_short: "No squadron",
      s_best: "Best score", s_ff: "Friendly kills", s_deaths: "Deaths", s_quals: "Qualifications", last_flown: "Last flown", board_place: "Leaderboard",
      grades_h: "Grades", flown_h: "Flown", quals_h: "Qualifications", courses_h: "Courses", no_quals: "No qualifications yet.",
      cs_not_started: "Not started", cs_in_progress: "In progress", cs_ready: "Ready for sign-off", cs_complete: "Complete", instructor_word: "instructor", nav_ops: "Operations", all_ops: "All operations",
      brandsub: "Virtual Egyptian Air Force", menu: "Menu",
      nav_home: "Home", nav_about: "About", nav_training: "Training", nav_pvp: "PvP", nav_airshow: "Airshow",
      nav_pilots: "Pilots", nav_board: "Leaderboard", nav_join: "Join us", lang_other: "العربية",
      sign_in: "Sign in", sign_in_discord: "Sign in with Discord", sign_out: "Sign out", my_profile: "My profile",
      nm_h: "You're not in the squadron yet", nm_p: "You signed in with Discord as {u}, but that account isn't on the EAF roster. Join our Discord and ask for a pilot slot. Once an instructor adds you, sign-ups, your profile and your photo unlock here.",
      su_h: "Your sign-up", su_signin: "Sign in with Discord to sign up for this operation.", su_closed: "Sign-ups for this operation are closed or not open yet.",
      su_in: "You're on the flight list.", su_res: "You're in the reserves.", su_out: "You're not signed up.",
      do_signup: "Sign up", do_reserve: "Reserve", do_withdraw: "Withdraw", su_pending: "Request sent. The manager confirms it within a minute or two.",
      su_failed: "Couldn't send that: ", su_last: "Last answer: ", photo_change: "Change photo", photo_add: "Add a profile photo", photo_busy: "Uploading…",
      photo_done: "Photo uploaded. It appears on the roster after the next website update.", photo_bad: "That file isn't an image this browser can read.",
      patches_h: "Mission patches", patches_intro: "Earned by flying the operation, or awarded by the instructors.", no_patches: "No patches yet.", holders: "holders", op_patch: "Mission patch",
      session_lost: "Your sign-in expired. Sign in again.",
      disclaimer: "VEAF is a virtual squadron of DCS World players. It is a gaming community and is not affiliated with, endorsed by or part of the Egyptian Air Force or the Egyptian Armed Forces. Ranks are squadron ranks.",
      hero_eyebrow: "DCS World · Mil-Sim squadron",
      hero_h1: "The first Egyptian <em>mil&#8209;sim</em> squadron in DCS",
      hero_lede: "We train, fly and fight as a squadron: briefed sorties, real procedures, honest debriefs. Arabic on the radio, beginners welcome.",
      join_discord: "Join us on Discord", see_training: "See the training",
      r_pilots: "Active pilots", r_quals: "Qualifications", r_sorties: "Pilot sorties", r_air: "Air kills", r_ground: "Ground kills",
      about_eyebrow: "About us", about_h: "A squadron, not a server",
      about_p1: "VEAF is the first Egyptian military-simulation squadron in DCS World. We fly together on a schedule, brief before we step, follow standard procedures in the air and debrief every sortie afterwards.",
      about_p2: "Every flight is recorded and reviewed. Pilots earn ranks and qualifications through the training syllabus, from a student's first CCIP pass to leading a SEAD package.",
      f_lang: "Language", f_lang_v: "Arabic on comms, standard English brevity",
      f_focus: "Focus", f_focus_v: "Air-to-ground, BVR, ACM, SEAD/DEAD, BFM",
      f_who: "Who", f_who_v: "Any age, any experience. We teach from the first takeoff.",
      f_comp: "Competition", f_comp_v: "PvP missions and BVR tournaments against other squadrons",
      train_eyebrow: "Specialisations", train_h: "What we train",
      train_intro: "Six programmes make up the syllabus. Each one ends in a check flight; pass it and the qualification shows on your pilot profile.",
      all_programmes: "All programmes",
      pvp_eyebrow: "Competition", pvp_h: "PvP missions and BVR tournaments",
      pvp_intro: "Training is half of it. We test it against real opponents: squadron-versus-squadron scrims, round-based BVR tournaments and open PvP missions.",
      pvp_missions: "PvP missions", pvp_missions_p: "Two sides, one theatre, live opponents. Strike packages, CAP and escort against another squadron, planned and briefed like any operation.",
      bvr_t: "BVR tournaments", bvr_t_p: "Round-based BVR fights, 2v2 up to 6v6. Every round is recorded; kills, losses and the final score are posted after the event.",
      recent_results: "Recent results", no_results: "No scrim results published yet.",
      vs: "vs", rounds: "rounds", kills: "kills",
      airshow_eyebrow: "Airshow", airshow_h: "Airshow", airshow_intro: "Formation aerobatics in the black display livery, with smoke. The airshow team flies tight formation and coordinated passes for squadron events.",
      gallery: "From the squadron", nav_more: "More",
      pilots_h: "Pilots", pilots_intro: "Current squadron members, their rank and the aircraft they fly. Select a pilot for their skills, qualifications and mission log.",
      all_aircraft: "All aircraft", search: "Search callsign", no_pilots: "No pilots match.",
      board_h: "Leaderboard", board_intro: "Totals from debriefed missions. Select a column to sort.",
      c_pilot: "Pilot", c_rank: "Rank", c_squadron: "Squadron", all_squadrons: "All squadrons", no_squadron: "Not yet in a squadron", c_missions: "Missions", c_score: "Score", c_avg: "Avg", c_air: "A/A kills", c_ground: "A/G kills",
      c_quals: "Quals", c_hours: "Hours", c_date: "Date", c_mission: "Mission", c_type: "Type", c_grade: "Grade",
      back_pilots: "← All pilots", joined: "Joined", flies: "Flies", squadron: "Squadron",
      skills: "Skills", qualified: "QUAL", no_skills: "No skills assessed yet.",
      history: "Mission log", no_history: "No debriefed missions yet.", training_tag: "training",
      s_missions: "Missions", s_score: "Total score", s_avg: "Average", s_air: "Air kills", s_ground: "Ground kills", s_hours: "Flight hours",
      not_found: "That pilot is not on the roster.",
      join_eyebrow: "Join us", join_h: "Fly with VEAF",
      join_intro: "We are always looking for pilots who want to fly properly and fly together. You do not need experience. You need to show up, listen on the radio and want to get better.",
      req_h: "Requirements",
      steps_h: "How to join",
      step1: "Join our Discord server with the button on this page.",
      step2: "Introduce yourself in the recruitment channel and register with the squadron bot so your flights are recorded.",
      step3: "Fly an assessment sortie with an instructor. It is not a test you fail; it tells us where to start you.",
      step4: "Start the syllabus as a Student. Your rank, qualifications and mission log appear on this site as you progress.",
      discord_h: "Our Discord", discord_p: "Briefings, schedules, sign-ups and debriefs all happen on Discord.",
      privacy: "Privacy: this site shows only your callsign, squadron rank, aircraft, training results and mission scores. We never publish real names, Discord accounts or contact details. Ask any staff member and your profile will be hidden from the site.",
      loading: "Loading squadron data…", load_failed: "The squadron data could not be loaded. Refresh the page; if it keeps happening, tell the staff on Discord.",
      updated: "Squadron data updated", unranked: "Unranked"
    },
    ar: {
      ops_eyebrow: "العمليات", ops_h: "العمليات", ops_intro: "الإيجازات القادمة وكل عملية تم تقييمها، مع نتائج كل طيار وتقرير التقييم الكامل.",
      upcoming_h: "الإيجازات القادمة", debriefed_h: "العمليات المُقيّمة", no_upcoming: "لا توجد عملية مخططة بعد. تظهر الإيجازات هنا فور جدولتها.",
      no_ops: "لا توجد عمليات مطابقة.", all_types: "كل الأنواع", search_ops: "ابحث عن عملية أو طيار", signed_up: "مسجل", reserves: "الاحتياط", nobody_yet: "لا أحد بعد.",
      c_report: "التقرير", open_report: "فتح", open_full_report: "افتح تقرير التقييم الكامل", back_ops: "→ كل العمليات", op_not_found: "هذه العملية غير موجودة على الموقع.",
      debriefed_by: "قيّمها", brief_h: "الإيجاز", card_h: "بطاقة المهمة", teams_h: "التشكيلات", debrief_h: "التقييم", lessons_h: "الدروس المستفادة", results_h: "النتائج",
      c_ff: "نيران صديقة", c_deaths: "خسائر", c_minutes: "دقائق", c_notes: "ملاحظات",
      k_time: "وقت المهمة", k_step: "الخروج", k_takeoff: "الإقلاع", k_tot: "الوصول للهدف", k_rtb: "العودة", k_dep: "مدرج الإقلاع", k_arr: "مدرج الهبوط", k_altn: "المطار البديل",
      k_bulls: "Bullseye", k_tacan: "TACAN", k_laser: "كود الليزر", k_iff: "IFF", k_joker: "Joker", k_bingo: "Bingo", k_datalink: "Datalink", k_loadout: "التسليح",
      sq_standings: "ترتيب الأسراب", pilots_word: "طيار", sorties_word: "طلعة", no_squadron_short: "بدون سرب",
      s_best: "أفضل نتيجة", s_ff: "نيران صديقة", s_deaths: "خسائر", s_quals: "المؤهلات", last_flown: "آخر طلعة", board_place: "الترتيب",
      grades_h: "التقديرات", flown_h: "أنواع الطلعات", quals_h: "المؤهلات", courses_h: "الدورات", no_quals: "لا توجد مؤهلات بعد.",
      cs_not_started: "لم تبدأ", cs_in_progress: "قيد التقدم", cs_ready: "جاهز للاعتماد", cs_complete: "مكتملة", instructor_word: "المدرب", nav_ops: "العمليات", all_ops: "كل العمليات",
      brandsub: "القوات الجوية المصرية الافتراضية", menu: "القائمة",
      nav_home: "الرئيسية", nav_about: "من نحن", nav_training: "التدريب", nav_pvp: "المنافسات", nav_airshow: "العروض الجوية",
      nav_pilots: "الطيارون", nav_board: "الترتيب", nav_join: "انضم إلينا", lang_other: "English",
      sign_in: "تسجيل الدخول", sign_in_discord: "الدخول عبر ديسكورد", sign_out: "تسجيل الخروج", my_profile: "ملفي",
      nm_h: "أنت لست في السرب بعد", nm_p: "دخلت عبر ديسكورد باسم {u}، لكن هذا الحساب غير موجود في قائمة طياري EAF. انضم إلى الديسكورد واطلب مكانًا كطيار. بعد أن يضيفك أحد المدربين ستتمكن هنا من التسجيل في العمليات وتعديل ملفك وصورتك.",
      su_h: "تسجيلك", su_signin: "سجّل الدخول عبر ديسكورد للتسجيل في هذه العملية.", su_closed: "التسجيل في هذه العملية مغلق أو لم يُفتح بعد.",
      su_in: "أنت في قائمة الطيران.", su_res: "أنت في الاحتياط.", su_out: "لست مسجلًا.",
      do_signup: "سجّلني", do_reserve: "احتياط", do_withdraw: "انسحاب", su_pending: "تم إرسال الطلب. يؤكده البرنامج خلال دقيقة أو دقيقتين.",
      su_failed: "تعذر الإرسال: ", su_last: "آخر رد: ", photo_change: "تغيير الصورة", photo_add: "أضف صورة شخصية", photo_busy: "جارٍ الرفع…",
      photo_done: "تم رفع الصورة. ستظهر في قائمة الطيارين بعد التحديث القادم للموقع.", photo_bad: "هذا الملف ليس صورة يمكن للمتصفح قراءتها.",
      patches_h: "شارات المهمات", patches_intro: "تُكتسب بالطيران في العملية أو يمنحها المدربون.", no_patches: "لا توجد شارات بعد.", holders: "حاملين", op_patch: "شارة المهمة",
      session_lost: "انتهت جلسة الدخول. سجّل الدخول مرة أخرى.",
      disclaimer: "VEAF سرب افتراضي من لاعبي DCS World. هو مجتمع ألعاب، وليس تابعًا للقوات الجوية المصرية أو القوات المسلحة المصرية ولا معتمدًا منها. الرتب رتب داخل السرب فقط.",
      hero_eyebrow: "DCS World · سرب محاكاة عسكرية",
      hero_h1: "أول سرب <em>محاكاة عسكرية</em> مصري في DCS",
      hero_lede: "نتدرب ونطير ونقاتل كسرب واحد: طلعات بإيجاز، إجراءات حقيقية، وتقييم صريح بعد كل طلعة. العربية على اللاسلكي، والمبتدئون مرحب بهم.",
      join_discord: "انضم إلينا على ديسكورد", see_training: "برامج التدريب",
      r_pilots: "طيار نشط", r_quals: "مؤهل", r_sorties: "طلعة", r_air: "إسقاط جوي", r_ground: "هدف أرضي",
      about_eyebrow: "من نحن", about_h: "سرب، وليس مجرد سيرفر",
      about_p1: "VEAF هو أول سرب مصري للمحاكاة العسكرية في DCS World. نطير معًا وفق جدول، ونأخذ إيجازًا قبل الإقلاع، ونتبع الإجراءات القياسية في الجو، ونقيّم كل طلعة بعد الهبوط.",
      about_p2: "كل طلعة تُسجَّل وتُراجَع. يحصل الطيارون على الرتب والمؤهلات عبر منهج التدريب، من أول قصف CCIP للطالب حتى قيادة حزمة SEAD.",
      f_lang: "اللغة", f_lang_v: "العربية على اللاسلكي مع المصطلحات الإنجليزية القياسية",
      f_focus: "التخصص", f_focus_v: "جو-أرض، BVR، ACM، SEAD/DEAD، BFM",
      f_who: "من يمكنه الانضمام", f_who_v: "أي عمر وأي مستوى خبرة. نعلّمك من أول إقلاع.",
      f_comp: "المنافسات", f_comp_v: "مهمات PvP وبطولات BVR ضد أسراب أخرى",
      train_eyebrow: "التخصصات", train_h: "ماذا نتدرب",
      train_intro: "يتكون المنهج من ستة برامج. ينتهي كل برنامج بطلعة اختبار؛ عند اجتيازها يظهر المؤهل في ملفك.",
      all_programmes: "كل البرامج",
      pvp_eyebrow: "المنافسات", pvp_h: "مهمات PvP وبطولات BVR",
      pvp_intro: "التدريب نصف العمل. نختبره أمام خصوم حقيقيين: مواجهات بين الأسراب، وبطولات BVR بالجولات، ومهمات PvP مفتوحة.",
      pvp_missions: "مهمات PvP", pvp_missions_p: "طرفان ومسرح عمليات واحد وخصوم أحياء. حزم ضرب ودوريات جوية ومرافقة ضد سرب آخر، بتخطيط وإيجاز كأي عملية.",
      bvr_t: "بطولات BVR", bvr_t_p: "قتال BVR بالجولات من 2 ضد 2 حتى 6 ضد 6. كل جولة مسجلة، وتُنشر الإسقاطات والخسائر والنتيجة بعد الحدث.",
      recent_results: "أحدث النتائج", no_results: "لا توجد نتائج منشورة بعد.",
      vs: "ضد", rounds: "جولات", kills: "إسقاطات",
      airshow_eyebrow: "العروض الجوية", airshow_h: "العروض الجوية", airshow_intro: "استعراض جوي بتشكيلات متقاربة بطلاء العرض الأسود مع الدخان. يطير فريق العروض تشكيلات ومرورًا منسقًا في مناسبات السرب.",
      gallery: "من السرب", nav_more: "المزيد",
      pilots_h: "الطيارون", pilots_intro: "أعضاء السرب الحاليون ورتبهم والطائرات التي يطيرونها. اختر طيارًا لعرض مهاراته ومؤهلاته وسجل مهماته.",
      all_aircraft: "كل الطائرات", search: "ابحث بالنداء", no_pilots: "لا يوجد طيار مطابق.",
      board_h: "الترتيب", board_intro: "مجاميع من المهمات المُقيّمة. اختر عمودًا للترتيب.",
      c_pilot: "الطيار", c_rank: "الرتبة", c_squadron: "السرب", all_squadrons: "كل الأسراب", no_squadron: "لم ينضم إلى سرب بعد", c_missions: "المهمات", c_score: "النقاط", c_avg: "المتوسط", c_air: "جو-جو", c_ground: "جو-أرض",
      c_quals: "مؤهلات", c_hours: "ساعات", c_date: "التاريخ", c_mission: "المهمة", c_type: "النوع", c_grade: "التقدير",
      back_pilots: "→ كل الطيارين", joined: "انضم", flies: "يطير", squadron: "السرب",
      skills: "المهارات", qualified: "مؤهل", no_skills: "لم تُقيَّم مهارات بعد.",
      history: "سجل المهمات", no_history: "لا توجد مهمات مُقيّمة بعد.", training_tag: "تدريب",
      s_missions: "المهمات", s_score: "مجموع النقاط", s_avg: "المتوسط", s_air: "إسقاط جوي", s_ground: "هدف أرضي", s_hours: "ساعات الطيران",
      not_found: "هذا الطيار غير موجود في القائمة.",
      join_eyebrow: "انضم إلينا", join_h: "طِر مع VEAF",
      join_intro: "نبحث دائمًا عن طيارين يريدون الطيران بشكل صحيح ومعًا. لا تحتاج إلى خبرة. تحتاج أن تحضر، وتسمع على اللاسلكي، وتريد أن تتحسن.",
      req_h: "المتطلبات",
      steps_h: "خطوات الانضمام",
      step1: "انضم إلى سيرفر الديسكورد من الزر في هذه الصفحة.",
      step2: "عرّف بنفسك في قناة التجنيد وسجّل مع بوت السرب حتى تُسجَّل طلعاتك.",
      step3: "طِر طلعة تقييم مع مدرب. ليست اختبارًا ترسب فيه، بل تحدد من أين تبدأ.",
      step4: "ابدأ المنهج برتبة طالب. تظهر رتبتك ومؤهلاتك وسجل مهماتك هنا مع تقدمك.",
      discord_h: "الديسكورد", discord_p: "الإيجازات والجداول والتسجيل والتقييمات كلها على الديسكورد.",
      privacy: "الخصوصية: يعرض هذا الموقع النداء والرتبة والطائرة ونتائج التدريب ودرجات المهمات فقط. لا ننشر الأسماء الحقيقية ولا حسابات ديسكورد ولا بيانات الاتصال. اطلب من أي عضو في الإدارة وسيُخفى ملفك من الموقع.",
      loading: "جارٍ تحميل بيانات السرب…", load_failed: "تعذر تحميل بيانات السرب. حدّث الصفحة، وإن تكرر ذلك أخبر الإدارة على الديسكورد.",
      updated: "آخر تحديث لبيانات السرب", unranked: "بدون رتبة"
    }
  };

  var PROGRAMMES = [
    { code: "BSA", img: "wing-bomb", en: ["Basic Surface Attack", "Introduction to air-to-ground attack procedures.", ["CCIP and CCRP deliveries", "Dive angles and release parameters", "Strafe patterns and range discipline", "Hard deck and safe escape"]],
      ar: ["الهجوم الأرضي الأساسي", "مقدمة في إجراءات الهجوم جو-أرض.", ["القصف بـ CCIP و CCRP", "زوايا الانقضاض ومعايير الإطلاق", "أنماط الرشاش وانضباط الميدان", "الارتفاع الأدنى والخروج الآمن"]], lvl: "Student → Wingman" },
    { code: "SAT", img: "bombs-away", en: ["Surface Attack Tactics", "More advanced strike tactics and coordinated attacks.", ["Pop-up attacks and time on target", "Coordinated multi-axis strikes", "CAS with JTAC talk-ons", "Low-level threat avoidance"]],
      ar: ["تكتيكات الهجوم الأرضي", "تكتيكات ضرب متقدمة وهجمات منسقة.", ["هجمات الارتفاع المفاجئ وتوقيت الوصول للهدف", "ضربات منسقة من محاور متعددة", "الإسناد الجوي القريب مع JTAC", "تجنب التهديد على ارتفاع منخفض"]], lvl: "Wingman → Element lead" },
    { code: "BVR", img: "close-formation", en: ["Beyond Visual Range Combat", "Missile kinematics, notching, teamwork and comms.", ["Missile energy and launch ranges", "Notching and defending", "Two-ship contracts and sorting", "Brevity comms with AWACS"]],
      ar: ["القتال خارج مدى الرؤية", "حركية الصواريخ، النوتش، العمل الجماعي والاتصالات.", ["طاقة الصاروخ ومديات الإطلاق", "النوتش والدفاع", "عقود الثنائي والفرز", "المصطلحات المختصرة مع AWACS"]], lvl: "Wingman → Flight lead" },
    { code: "ACM", img: "desert-three", en: ["Air Combat Maneuvering", "1 v 2 tactics and 2 v 2 tactics.", ["Engaged and supporting roles", "Surviving and separating in a 1 v 2", "Mutual support in a 2 v 2", "Comms under load"]],
      ar: ["المناورات القتالية الجوية", "تكتيكات 1 ضد 2 و 2 ضد 2.", ["دور المشتبك ودور المساند", "النجاة والانفصال في 1 ضد 2", "الدعم المتبادل في 2 ضد 2", "الاتصالات تحت الضغط"]], lvl: "After BFM" },
    { code: "SEAD/DEAD", img: "viper-9526", en: ["Suppression / Destruction of Enemy Air Defenses", "Teamwork tactics and weapons employment.", ["HARM employment", "Threat rings and route planning", "SEAD escort for strike packages", "DEAD with stand-off weapons"]],
      ar: ["إخماد / تدمير الدفاع الجوي المعادي", "تكتيكات العمل الجماعي واستخدام الأسلحة.", ["استخدام صواريخ HARM", "دوائر التهديد وتخطيط المسار", "مرافقة SEAD لحزم الضرب", "التدمير بأسلحة المواجهة"]], lvl: "Element lead" },
    { code: "BFM", img: "pair-silver", en: ["Basic Fighter Maneuvers", "The one-versus-one foundation: energy, angles, turn circles and the gun.", ["Energy and turn performance", "Offensive, defensive and neutral starts", "Guns and short-range missiles", "Knock-it-off and training rules"]],
      ar: ["المناورات القتالية الأساسية", "أساس القتال واحد ضد واحد: الطاقة والزوايا ودوائر الدوران والمدفع.", ["الطاقة وأداء الدوران", "بدايات هجومية ودفاعية ومحايدة", "المدفع والصواريخ قصيرة المدى", "إيقاف الاشتباك وقواعد التدريب"]], lvl: "Student → Wingman" }
  ];

  var REQS = {
    en: [
      ["yes", "Arabic speaking", "We are an Arabic squadron. Briefings and comms are in Arabic, with standard English brevity words."],
      ["yes", "No minimum age", "Any age is welcome. What matters is discipline on the radio and respect for the people you fly with."],
      ["yes", "Beginners welcome", "You do not need any experience. Instructors teach you from start-up and takeoff onwards."],
      ["", "DCS World and a microphone", "A working DCS World install with at least one combat module, Discord and a microphone for comms."],
      ["", "Follow the SOPs", "You fly by the squadron's standard operating procedures and follow the flight lead and the chain of command."],
      ["", "No real military status", "You do not need to be, or have been, in any armed force. Squadron ranks are earned in the simulator."],
      ["", "Attend regularly", "Show up to scheduled training and operations. Tell your lead when you cannot make it."],
      ["", "Experienced pilots", "If you already fly at a high level, tell us. You can be fast-tracked through check flights instead of starting from the first lesson."]
    ],
    ar: [
      ["yes", "التحدث بالعربية", "نحن سرب عربي. الإيجازات والاتصالات بالعربية مع المصطلحات الإنجليزية القياسية."],
      ["yes", "لا يوجد حد أدنى للعمر", "كل الأعمار مرحب بها. المهم هو الانضباط على اللاسلكي واحترام من تطير معهم."],
      ["yes", "المبتدئون مرحب بهم", "لا تحتاج إلى أي خبرة. يعلّمك المدربون من تشغيل المحرك والإقلاع فما بعد."],
      ["", "DCS World وميكروفون", "نسخة عاملة من DCS World مع طائرة قتالية واحدة على الأقل، وديسكورد، وميكروفون للاتصالات."],
      ["", "اتباع الإجراءات القياسية", "تطير وفق الإجراءات القياسية للسرب وتتبع قائد التشكيل وتسلسل القيادة."],
      ["", "لا يشترط أي صفة عسكرية حقيقية", "لا يلزم أن تكون في أي قوات مسلحة. الرتب في السرب تُكتسب داخل المحاكي."],
      ["", "الحضور المنتظم", "احضر التدريبات والعمليات المجدولة، وأبلغ قائدك إذا لم تستطع الحضور."],
      ["", "الطيارون ذوو الخبرة", "إذا كنت تطير بمستوى عالٍ أخبرنا، ويمكن تسريعك عبر طلعات اختبار بدل البدء من الدرس الأول."]
    ]
  };

  var GALLERY = ["pyramids", "alexandria-break", "alexandria-port", "desert-three", "takeoff-dusk", "tanker", "close-formation",
    "coast-three", "ramp", "cockpit-formation", "bombs-away", "pair-silver", "viper-9526", "wing-bomb"];

  /* ------------------------------------------------------------- helpers */
  function t(k) { return (T[LANG] && T[LANG][k]) || T.en[k] || k; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "pilot"; }
  function fmt(n, d) {
    if (n === null || n === undefined || n === "" || isNaN(n)) return "–";
    return Number(n).toLocaleString(LANG === "ar" ? "ar-EG" : "en-GB", { maximumFractionDigits: d || 0, minimumFractionDigits: d && Number(n) % 1 ? 1 : 0 });
  }
  function img(name, alt, eager) {
    return '<img src="img/' + name + '-sm.jpg" srcset="img/' + name + '-sm.jpg 800w, img/' + name + '.jpg 1920w" sizes="(max-width: 800px) 100vw, 50vw" alt="' +
      esc(alt) + '"' + (eager ? "" : ' loading="lazy"') + ' data-full="img/' + name + '.jpg">';
  }
  function rankName(r) { if (!r) return t("unranked"); return (LANG === "ar" ? (r.ar || r.en) : (r.en || r.ar)) || t("unranked"); }
  function pilotBySlug(s) {
    var ps = (DATA && DATA.pilots) || [];
    for (var i = 0; i < ps.length; i++) if (slug(ps[i].callsign) === s) return ps[i];
    return null;
  }
  function initials(cs) { return esc(String(cs || "?").replace(/[^A-Za-z0-9\u0600-\u06FF]/g, "").slice(0, 2).toUpperCase() || "?"); }
  function discordBtn(cls) {
    return '<a class="btn ' + (cls || "primary") + '" href="' + esc((DATA && DATA.join_url) || DISCORD) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.3 4.4A19.6 19.6 0 0 0 15.4 3l-.6 1.3a18 18 0 0 0-5.6 0L8.6 3a19.6 19.6 0 0 0-4.9 1.5C.6 9.1-.3 13.6.1 18.1a19.8 19.8 0 0 0 6 3l1.3-2a12.7 12.7 0 0 1-2-1l.5-.4a14.1 14.1 0 0 0 12.2 0l.5.4c-.6.4-1.3.7-2 1l1.3 2a19.7 19.7 0 0 0 6-3c.5-5.2-.9-9.7-3.6-13.7ZM8 15.4c-1.2 0-2.2-1.1-2.2-2.4S6.8 10.6 8 10.6s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>' +
      esc(t("join_discord")) + "</a>";
  }

  /* --------------------------------------------------------------- pages */
  function readout() {
    var x = (DATA && DATA.totals) || {};
    return '<div class="readout-band"><div class="wrap"><div class="readout">' + [["pilots", "r_pilots"], ["sorties", "r_sorties"], ["qualifications", "r_quals"], ["air_kills", "r_air"], ["ground_kills", "r_ground"]]
      .map(function (p) { return "<div><b>" + fmt(x[p[0]]) + "</b><span>" + esc(t(p[1])) + "</span></div>"; }).join("") + "</div></div></div>";
  }
  function prog(p, wide) {
    var c = p[LANG];
    return '<article class="prog' + (wide ? " wide" : "") + '">' + img(p.img, c[0]) + '<div class="body"><span class="code">' + esc(p.code) + "</span><h3>" + esc(c[0]) +
      "</h3><p>" + esc(c[1]) + "</p><ul>" + c[2].map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + '</ul><span class="lvl">' + esc(p.lvl) + "</span></div></article>";
  }

  function pageHome() {
    var sq = (DATA && DATA.squadron) || {};
    return '<section class="hero">' + img("pyramids", "Two VEAF F-16s over the Giza pyramids", true).replace("<img ", '<img class="bg" ') +
      '<div class="wrap hero-grid"><div class="hero-copy">' + (sq.motto ? '<p class="motto" lang="ar">' + esc(sq.motto) + "</p>" : "") +
      '<span class="eyebrow">' + esc(t("hero_eyebrow")) + "</span><h1>" + t("hero_h1") + '</h1><p class="lede">' + esc(t("hero_lede")) +
      '</p><div class="cta-row">' + discordBtn() + '<a class="btn" href="#training">' + esc(t("see_training")) + '</a></div></div><img class="crest" src="img/logo.webp" width="512" height="512" alt="Virtual Egyptian Air Force crest"></div></section>' + readout() +
      '<section class="band"><div class="wrap split"><div><span class="eyebrow">' + esc(t("about_eyebrow")) + "</span><h2>" + esc(t("about_h")) + "</h2><p>" +
      esc(t("about_p1")) + "</p>" + facts() + "</div>" + img("ramp", "VEAF F-16s on the ramp") + "</div></section>" +
      '<section class="band"><div class="wrap"><span class="eyebrow">' + esc(t("train_eyebrow")) + "</span><h2>" + esc(t("train_h")) + '</h2><p class="intro">' +
      esc(t("train_intro")) + '</p><div class="programs">' + PROGRAMMES.map(function (p) { return prog(p); }).join("") + "</div></div></section>" +
      '<section class="band"><div class="wrap split">' + img("alexandria-break", "A pair breaking over Alexandria") + "<div><span class=\"eyebrow\">" + esc(t("pvp_eyebrow")) +
      "</span><h2>" + esc(t("pvp_h")) + "</h2><p>" + esc(t("pvp_intro")) + '</p><div class="cta-row"><a class="btn" href="#pvp">' + esc(t("nav_pvp")) + '</a><a class="btn" href="#leaderboard">' +
      esc(t("nav_board")) + "</a></div></div></div></section>" + homeOps() + joinBand();
  }
  function facts() {
    return '<ul class="facts">' + [["f_lang", "f_lang_v"], ["f_focus", "f_focus_v"], ["f_who", "f_who_v"], ["f_comp", "f_comp_v"]].map(function (f) {
      return "<li><span>" + esc(t(f[0])) + "</span><span>" + esc(t(f[1])) + "</span></li>";
    }).join("") + "</ul>";
  }
  function joinBand() {
    return '<section class="band"><div class="wrap split"><div><span class="eyebrow">' + esc(t("join_eyebrow")) + "</span><h2>" + esc(t("join_h")) + "</h2><p>" +
      esc(t("join_intro")) + '</p><div class="cta-row">' + discordBtn() + '<a class="btn" href="#join">' + esc(t("req_h")) + "</a></div></div>" +
      img("takeoff-dusk", "Takeoff at dusk") + "</div></section>";
  }
  function head(eyebrow, h, p) {
    return '<div class="page-head"><div class="wrap">' + (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + "</span>" : "") + "<h1>" + esc(h) + "</h1>" + (p ? "<p>" + esc(p) + "</p>" : "") + "</div></div>";
  }

  function pageAbout() {
    return head(t("about_eyebrow"), t("about_h"), "") + '<section class="band"><div class="wrap split"><div><p>' + esc(t("about_p1")) + "</p><p>" + esc(t("about_p2")) + "</p>" +
      facts() + "</div>" + img("coast-three", "Three-ship along the coast") + "</div></section>" + readout() + joinBand();
  }

  function pageTraining() {
    return head(t("train_eyebrow"), t("train_h"), t("train_intro")) + '<section class="band"><div class="wrap"><div class="programs">' +
      PROGRAMMES.map(function (p) { return prog(p); }).join("") + "</div></div></section>" + joinBand();
  }

  function pagePvp() {
    var s = (DATA && DATA.scrims) || [];
    var rows = s.length ? s.map(function (m) {
      var k = (m.kills_us != null || m.kills_them != null) ? " · " + fmt(m.kills_us) + "–" + fmt(m.kills_them) + " " + esc(t("kills")) : "";
      return '<div class="result"><span class="d">' + esc(m.date) + '</span><div class="vs"><h3>' + esc(m.name) + "</h3><span class=\"tag\">" + esc(m.type || "BVR") + "</span> " +
        (m.opponent ? esc(t("vs")) + " " + esc(m.opponent) : "") + (m.rounds ? " · " + fmt(m.rounds) + " " + esc(t("rounds")) : "") + k + '</div><span class="score">' + esc(m.result || "") + "</span></div>";
    }).join("") : '<p class="empty">' + esc(t("no_results")) + "</p>";
    return head(t("pvp_eyebrow"), t("pvp_h"), t("pvp_intro")) + '<section class="band"><div class="wrap"><div class="programs">' +
      '<article class="prog">' + img("alexandria-break", t("pvp_missions")) + '<div class="body"><span class="code">PVP</span><h3>' + esc(t("pvp_missions")) + "</h3><p>" + esc(t("pvp_missions_p")) + "</p></div></article>" +
      '<article class="prog">' + img("close-formation", t("bvr_t")) + '<div class="body"><span class="code">BVR</span><h3>' + esc(t("bvr_t")) + "</h3><p>" + esc(t("bvr_t_p")) + "</p></div></article>" +
      '<article class="prog">' + img("cockpit-formation", "ACM") + '<div class="body"><span class="code">ACM · BFM</span><h3>' + esc(PROGRAMMES[3][LANG][0]) + "</h3><p>" + esc(PROGRAMMES[3][LANG][1]) + "</p></div></article>" +
      '</div></div></section><section class="band"><div class="wrap"><h2>' + esc(t("recent_results")) + '</h2><div class="results">' + rows + "</div></div></section>";
  }

  function pageAirshow() {
    return head(t("airshow_eyebrow"), t("airshow_h"), t("airshow_intro")) + '<section class="band"><div class="wrap"><div class="feature">' +
      img("airshow-ramp", "The airshow team on the ramp in display livery", true) + img("airshow-smoke", "Airshow pass with smoke", true) +
      "</div><h2>" + esc(t("gallery")) + '</h2><div class="gallery">' + GALLERY.map(function (g) {
        return "<figure>" + img(g, g.replace(/-/g, " ")) + "</figure>";
      }).join("") + "</div></div></section>";
  }

  var rosterFilter = { ac: "", sq: "", q: "" };
  function pagePilots() {
    var ps = (DATA && DATA.pilots) || [];
    var types = {};
    ps.forEach(function (p) { (p.aircraft || []).forEach(function (a) { types[a] = (types[a] || 0) + 1; }); });
    var chips = '<button class="chip" type="button" data-ac="" aria-pressed="' + (!rosterFilter.ac) + '">' + esc(t("all_aircraft")) + "</button>" +
      Object.keys(types).sort(function (a, b) { return types[b] - types[a]; }).map(function (a) {
        return '<button class="chip" type="button" data-ac="' + esc(a) + '" aria-pressed="' + (rosterFilter.ac === a) + '">' + esc(a) + "</button>";
      }).join("");
    var sqs = {};
    ps.forEach(function (p) { if (p.squadron) sqs[p.squadron] = 1; });
    var sqChips = Object.keys(sqs).length > 1 ? '<div class="filters" role="group" aria-label="' + esc(t("c_squadron")) + '"><button class="chip" type="button" data-sq="" aria-pressed="' + (!rosterFilter.sq) + '">' +
      esc(t("all_squadrons")) + "</button>" + Object.keys(sqs).sort().map(function (q) {
        return '<button class="chip" type="button" data-sq="' + esc(q) + '" aria-pressed="' + (rosterFilter.sq === q) + '">' + esc(q) + "</button>";
      }).join("") + "</div>" : "";
    return head("", t("pilots_h"), t("pilots_intro")) + '<section class="band"><div class="wrap">' + sqChips + '<div class="filters" role="group">' + chips +
      '<input class="search" id="pilot-search" type="search" placeholder="' + esc(t("search")) + '" aria-label="' + esc(t("search")) + '" value="' + esc(rosterFilter.q) + '"></div><div id="roster"></div></div></section>' +
      (((DATA && DATA.patches) || []).length ? '<section class="band"><div class="wrap"><h2>' + esc(t("patches_h")) + '</h2><p class="intro">' + esc(t("patches_intro")) + "</p>" + patchGrid(DATA.patches) + "</div></section>" : "");
  }
  function drawRoster() {
    var box = document.getElementById("roster");
    if (!box) return;
    var q = rosterFilter.q.trim().toLowerCase();
    var ps = ((DATA && DATA.pilots) || []).filter(function (p) {
      return (!rosterFilter.sq || p.squadron === rosterFilter.sq) && (!rosterFilter.ac || (p.aircraft || []).indexOf(rosterFilter.ac) >= 0) && (!q || String(p.callsign).toLowerCase().indexOf(q) >= 0);
    });
    if (!ps.length) { box.innerHTML = '<p class="empty">' + esc(t("no_pilots")) + "</p>"; return; }
    var html = "", last = null;
    ps.forEach(function (p) {
      var g = rankName(p.rank);
      if (g !== last) { if (last !== null) html += "</div>"; html += '<div class="group-label">' + esc(g) + (p.rank && p.rank.insignia ? ' · <span class="ins">' + esc(p.rank.insignia) + "</span>" : "") + '</div><div class="roster">'; last = g; }
      html += '<a class="plate" href="#pilot-' + slug(p.callsign) + '">' + avatar(p) + '<span class="who"><div class="cs">' + esc(p.callsign) +
        '</div><div class="rk">' + esc(rankName(p.rank)) + '</div>' + (p.squadron ? '<div class="sqn">' + esc(p.squadron) + "</div>" : "") + '<div class="ac">' + esc((p.aircraft || []).join(" · ") || "–") + "</div></span></a>";
    });
    box.innerHTML = html + "</div>";
  }

  /* ------------------------------------------------------- leaderboard */
  var boardSort = "score", boardSq = "*";
  var BOARD_COLS = [["missions", "c_missions", 0, ""], ["score", "c_score", 1, "sc"], ["average", "c_avg", 1, "opt"], ["air_kills", "c_air", 0, ""],
    ["ground_kills", "c_ground", 0, "opt2"], ["qualifications", "c_quals", 0, "opt"], ["hours", "c_hours", 1, "opt"]];
  function boardList() {
    return ((DATA && DATA.pilots) || []).slice().sort(function (a, b) {
      return (b.squadron ? 1 : 0) - (a.squadron ? 1 : 0) || (Number(b[boardSort]) || 0) - (Number(a[boardSort]) || 0) || String(a.callsign).localeCompare(b.callsign);
    });
  }
  function squadronStandings() {
    var by = {};
    ((DATA && DATA.pilots) || []).forEach(function (p) {
      var k = p.squadron || "";
      var s = by[k] || (by[k] = { name: k, pilots: 0, missions: 0, score: 0, hours: 0, air: 0, ground: 0, quals: 0 });
      s.pilots++; s.missions += p.missions || 0; s.score += p.score || 0; s.hours += p.hours || 0;
      s.air += p.air_kills || 0; s.ground += p.ground_kills || 0; s.quals += p.qualifications || 0;
    });
    return Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return (b.name ? 1 : 0) - (a.name ? 1 : 0) || b.score - a.score; });
  }
  function pageBoard() {
    var st = squadronStandings();
    var cards = st.filter(function (s) { return s.name; }).map(function (s, i) {
      return '<button type="button" class="sqcard' + (boardSq === s.name ? " on" : "") + '" data-bsq="' + esc(s.name) + '"><span class="sqpos">' + (i + 1) + '</span><span class="sqname">' + esc(s.name) +
        '</span><span class="sqline"><b>' + fmt(s.score, 0) + "</b> " + esc(t("c_score")) + " · " + fmt(s.pilots) + " " + esc(t("pilots_word")) + " · " + fmt(s.missions) + " " + esc(t("sorties_word")) +
        " · " + fmt(s.hours, 0) + " h</span></button>";
    }).join("");
    var chips = '<div class="filters" role="group" aria-label="' + esc(t("c_squadron")) + '"><button class="chip" type="button" data-bsq="*" aria-pressed="' + (boardSq === "*") + '">' + esc(t("all_squadrons")) + "</button>" +
      st.map(function (s) {
        var v = s.name || "-";
        return '<button class="chip" type="button" data-bsq="' + esc(v) + '" aria-pressed="' + (boardSq === v) + '">' + esc(s.name || t("no_squadron")) + "</button>";
      }).join("") + "</div>";
    return head("", t("board_h"), t("board_intro")).replace('class="page-head"', 'class="page-head compact"') +
      '<section class="band tight"><div class="wrap"><div id="podium" class="podium"></div>' +
      (cards ? '<h2 class="h-sm">' + esc(t("sq_standings")) + '</h2><div class="sqcards">' + cards + "</div>" : "") +
      chips + '<div class="table-wrap board" id="board"></div></div></section>';
  }
  function drawBoard() {
    var box = document.getElementById("board");
    if (!box) return;
    var all = boardList();
    var ps = all.filter(function (p) { return boardSq === "*" || (boardSq === "-" ? !p.squadron : p.squadron === boardSq); });
    var max = Math.max.apply(null, ps.map(function (p) { return Number(p[boardSort]) || 0; }).concat([1]));
    var pod = document.getElementById("podium");
    if (pod) {
      pod.innerHTML = ps.slice(0, 3).map(function (p, i) {
        return '<a class="pod p' + (i + 1) + '" href="#pilot-' + slug(p.callsign) + '"><span class="medal">' + (i + 1) + '</span><span class="cs">' + esc(p.callsign) + '</span><span class="rk">' + esc(rankName(p.rank)) +
          (p.squadron ? " · " + esc(p.squadron) : "") + '</span><span class="val">' + fmt(p[boardSort], 1) + " <small>" + esc(t(colLabel(boardSort))) + "</small></span></a>";
      }).join("");
    }
    var cols = 3 + BOARD_COLS.length;
    var th = '<th scope="col" class="pos">#</th><th scope="col">' + esc(t("c_pilot")) + '</th><th scope="col" class="sq">' + esc(t("c_squadron")) + "</th>" + BOARD_COLS.map(function (c) {
      return '<th scope="col" class="n ' + c[3] + '"' + (boardSort === c[0] ? ' aria-sort="descending"' : "") + '><button type="button" data-sort="' + c[0] + '">' + esc(t(c[1])) + "</button></th>";
    }).join("");
    var split = false;
    var rows = ps.map(function (p, i) {
      var head = "";
      if (!p.squadron && !split) {
        split = true;
        if (i > 0) head = '<tr class="split"><td colspan="' + cols + '">' + esc(t("no_squadron")) + "</td></tr>";
      }
      return head + '<tr class="' + (i < 3 ? "top3" : "") + '"><td class="pos">' + (i + 1) + '</td><td class="who"><a href="#pilot-' + slug(p.callsign) + '">' + esc(p.callsign) +
        '</a><span class="rk">' + esc(rankName(p.rank)) + '</span></td><td class="sq">' + esc(p.squadron || "–") + "</td>" +
        BOARD_COLS.map(function (c) {
          var v = fmt(p[c[0]], c[2]);
          if (c[0] === boardSort) v = '<span class="bar"><i style="width:' + Math.round(100 * (Number(p[c[0]]) || 0) / max) + '%"></i></span>' + v;
          return '<td class="n ' + c[3] + (c[0] === boardSort ? " on" : "") + '">' + v + "</td>";
        }).join("") + "</tr>";
    }).join("");
    box.innerHTML = ps.length ? "<table><thead><tr>" + th + "</tr></thead><tbody>" + rows + "</tbody></table>" : '<p class="empty">' + esc(t("no_pilots")) + "</p>";
  }
  function colLabel(k) { for (var i = 0; i < BOARD_COLS.length; i++) if (BOARD_COLS[i][0] === k) return BOARD_COLS[i][1]; return k; }

  /* -------------------------------------------------------- operations */
  var opFilter = { type: "", q: "" };
  function opBySlug(s) {
    var all = ((DATA && DATA.operations) || []).concat((DATA && DATA.upcoming) || []);
    for (var i = 0; i < all.length; i++) if (all[i].id === s) return all[i];
    return null;
  }
  function typeTags(o) {
    return (o.types || []).map(function (x) { return '<span class="tag">' + esc(x) + "</span>"; }).join("") + (o.training ? '<span class="tag">' + esc(t("training_tag")) + "</span>" : "");
  }
  function briefCard(o) {
    var c = o.card || {};
    return '<a class="brief" href="#op-' + esc(o.id) + '"><span class="when">' + esc(o.date) + (c.mission_time ? " · " + esc(c.mission_time) + "Z" : "") + '</span><span class="nm">' + esc(o.name) + "</span>" +
      '<span class="tags">' + typeTags(o) + "</span>" + (o.brief ? '<span class="ex">' + esc(String(o.brief).slice(0, 180)) + (String(o.brief).length > 180 ? "…" : "") + "</span>" : "") +
      '<span class="cnt">' + fmt((o.signed || []).length) + " " + esc(t("signed_up")) + "</span></a>";
  }
  function homeOps() {
    var up = ((DATA && DATA.upcoming) || []).slice(0, 3);
    var recent = ((DATA && DATA.operations) || []).slice(0, 3);
    if (!up.length && !recent.length) return "";
    var rec = recent.map(function (o) {
      return '<a class="brief done" href="#op-' + esc(o.id) + '"><span class="when">' + esc(o.date) + '</span><span class="nm">' + esc(o.name) + '</span><span class="tags">' + typeTags(o) + "</span>" +
        '<span class="cnt">' + fmt(o.pilots) + " " + esc(t("pilots_word")) + (o.average != null ? " · " + esc(t("c_avg")) + " " + fmt(o.average, 1) : "") + "</span></a>";
    }).join("");
    return '<section class="band"><div class="wrap"><span class="eyebrow">' + esc(t("ops_eyebrow")) + "</span><h2>" + esc(t("ops_h")) + "</h2>" +
      (up.length ? '<h3 class="h-sm">' + esc(t("upcoming_h")) + '</h3><div class="upcoming">' + up.map(briefCard).join("") + "</div>" : "") +
      (rec ? '<h3 class="h-sm">' + esc(t("debriefed_h")) + '</h3><div class="upcoming">' + rec + "</div>" : "") +
      '<p style="margin-top:18px"><a class="btn" href="#operations">' + esc(t("all_ops")) + "</a></p></div></section>";
  }
  function pageOps() {
    var up = (DATA && DATA.upcoming) || [];
    var types = {};
    ((DATA && DATA.operations) || []).forEach(function (o) { (o.types || []).forEach(function (x) { types[x] = (types[x] || 0) + 1; }); });
    var upHtml = up.length ? '<div class="upcoming">' + up.map(briefCard).join("") + "</div>" : '<p class="empty">' + esc(t("no_upcoming")) + "</p>";
    var chips = '<div class="filters" role="group"><button class="chip" type="button" data-otype="" aria-pressed="' + (!opFilter.type) + '">' + esc(t("all_types")) + "</button>" +
      Object.keys(types).sort(function (a, b) { return types[b] - types[a]; }).map(function (x) {
        return '<button class="chip" type="button" data-otype="' + esc(x) + '" aria-pressed="' + (opFilter.type === x) + '">' + esc(x) + " (" + types[x] + ")</button>";
      }).join("") + '<input class="search" id="op-search" type="search" placeholder="' + esc(t("search_ops")) + '" aria-label="' + esc(t("search_ops")) + '" value="' + esc(opFilter.q) + '"></div>';
    return head(t("ops_eyebrow"), t("ops_h"), t("ops_intro")).replace('class="page-head"', 'class="page-head compact"') +
      '<section class="band tight"><div class="wrap"><h2 class="h-sm">' + esc(t("upcoming_h")) + "</h2>" + upHtml + "</div></section>" +
      '<section class="band tight"><div class="wrap"><h2 class="h-sm">' + esc(t("debriefed_h")) + "</h2>" + chips + '<div id="oplist"></div></div></section>';
  }
  function drawOps() {
    var box = document.getElementById("oplist");
    if (!box) return;
    var q = opFilter.q.trim().toLowerCase();
    var os = ((DATA && DATA.operations) || []).filter(function (o) {
      return (!opFilter.type || (o.types || []).indexOf(opFilter.type) >= 0) &&
        (!q || (o.name + " " + (o.results || []).map(function (r) { return r.callsign; }).join(" ")).toLowerCase().indexOf(q) >= 0);
    });
    if (!os.length) { box.innerHTML = '<p class="empty">' + esc(t("no_ops")) + "</p>"; return; }
    box.innerHTML = '<div class="table-wrap"><table class="ops"><thead><tr><th scope="col">' + esc(t("c_date")) + '</th><th scope="col">' + esc(t("c_mission")) + '</th><th scope="col" class="opt">' +
      esc(t("c_type")) + '</th><th scope="col" class="n">' + esc(t("nav_pilots")) + '</th><th scope="col" class="n">' + esc(t("c_avg")) + '</th><th scope="col" class="n opt">' + esc(t("c_air")) +
      '</th><th scope="col" class="n opt">' + esc(t("c_ground")) + '</th><th scope="col" class="opt2">' + esc(t("c_report")) + "</th></tr></thead><tbody>" + os.map(function (o) {
        return '<tr><td class="mono">' + esc(o.date) + '</td><td class="who"><a href="#op-' + esc(o.id) + '">' + esc(o.name) + '</a></td><td class="opt">' + typeTags(o) + '</td><td class="n">' + fmt(o.pilots) +
          '</td><td class="n">' + fmt(o.average, 1) + '</td><td class="n opt">' + fmt(o.air_kills) + '</td><td class="n opt">' + fmt(o.ground_kills) + '</td><td class="opt2">' +
          (o.report ? '<a href="' + esc(o.report) + '" target="_blank" rel="noopener">' + esc(t("open_report")) + "</a>" : "–") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  }
  function cardGrid(c) {
    var keys = [["mission_time", "k_time", "Z"], ["step", "k_step", "Z"], ["takeoff", "k_takeoff", "Z"], ["tot", "k_tot", "Z"], ["rtb", "k_rtb", "Z"], ["dep_rwy", "k_dep"], ["arr_rwy", "k_arr"],
      ["altn", "k_altn"], ["bulls", "k_bulls"], ["tacan", "k_tacan"], ["laser", "k_laser"], ["iff", "k_iff"], ["joker", "k_joker"], ["bingo", "k_bingo"], ["datalink", "k_datalink"], ["loadout", "k_loadout"]];
    var cells = keys.filter(function (k) { return c[k[0]]; }).map(function (k) {
      return '<div><span>' + esc(t(k[1])) + '</span><b>' + esc(c[k[0]]) + (k[2] || "") + "</b></div>";
    });
    (c.freqs || []).forEach(function (f) { cells.push("<div><span>" + esc(f.label || "") + "</span><b>" + esc(f.mhz || "") + " MHz</b></div>"); });
    (c.headings || []).forEach(function (h) { cells.push("<div><span>" + esc(h.label || "") + "</span><b>" + esc(h.deg || "") + "°</b></div>"); });
    return cells.length ? '<div class="card-grid">' + cells.join("") + "</div>" : "";
  }
  function pageOp(s) {
    var o = opBySlug(s);
    var back = '<a class="back" href="#operations">' + esc(t("back_ops")) + "</a>";
    if (!o) return '<section class="band"><div class="wrap">' + back + '<p class="empty">' + esc(t("op_not_found")) + "</p></div></section>";
    var planned = !o.results;
    var c = o.card || {};
    var html = '<section class="band tight"><div class="wrap">' + back + '<span class="eyebrow">' + esc(planned ? t("upcoming_h") : t("debriefed_h")) + "</span><h1 class=\"op-h\">" + esc(o.name) + "</h1>" +
      '<p class="op-meta"><span class="mono">' + esc(o.date) + (c.mission_time ? " · " + esc(c.mission_time) + "Z" : "") + "</span> " + typeTags(o) +
      (o.instructor ? ' <span class="muted">· ' + esc(t("debriefed_by")) + " " + esc(o.instructor) + "</span>" : "") + "</p>" +
      (o.report ? '<p><a class="btn primary" href="' + esc(o.report) + '" target="_blank" rel="noopener">' + esc(t("open_full_report")) + "</a></p>" : "");
    if (o.brief) html += '<h2 class="h-sm">' + esc(t("brief_h")) + '</h2><div class="prose">' + esc(o.brief).replace(/\n/g, "<br>") + "</div>";
    var grid = cardGrid(c);
    if (grid) html += '<h2 class="h-sm">' + esc(t("card_h")) + "</h2>" + grid;
    if ((o.teams || []).length) {
      html += '<h2 class="h-sm">' + esc(t("teams_h")) + '</h2><div class="teams">' + o.teams.map(function (tm) {
        return '<div class="team"><b>' + esc(tm.name) + "</b>" + (tm.task ? ' <span class="tag">' + esc(tm.task) + "</span>" : "") +
          '<ul>' + (tm.pilots || []).map(function (n) { return "<li>" + pilotLink(n) + "</li>"; }).join("") + "</ul></div>";
      }).join("") + "</div>";
    }
    if ((o.patches || []).length) html += '<h2 class="h-sm">' + esc(t("op_patch")) + "</h2>" + patchGrid(o.patches);
    if (planned) {
      html += signupBox(o);
      html += '<h2 class="h-sm">' + esc(t("signed_up")) + "</h2><p>" + ((o.signed || []).map(pilotLink).join(", ") || esc(t("nobody_yet"))) +
        ((o.reserves || []).length ? '<br><span class="muted">' + esc(t("reserves")) + ": " + o.reserves.map(pilotLink).join(", ") + "</span>" : "") + "</p>";
    } else {
      if (o.narrative) html += '<h2 class="h-sm">' + esc(t("debrief_h")) + '</h2><div class="prose">' + esc(o.narrative).replace(/\n/g, "<br>") + "</div>";
      if ((o.lessons || []).length) html += '<h2 class="h-sm">' + esc(t("lessons_h")) + '</h2><ul class="lessons">' + o.lessons.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>";
      html += '<h2 class="h-sm">' + esc(t("results_h")) + '</h2><div class="table-wrap"><table class="res"><thead><tr><th scope="col">' + esc(t("c_pilot")) + '</th><th scope="col" class="opt">' + esc(t("c_squadron")) +
        '</th><th scope="col">' + esc(t("c_grade")) + '</th><th scope="col" class="n">' + esc(t("c_score")) + '</th><th scope="col" class="n">' + esc(t("c_air")) + '</th><th scope="col" class="n">' + esc(t("c_ground")) +
        '</th><th scope="col" class="n opt">' + esc(t("c_ff")) + '</th><th scope="col" class="n opt">' + esc(t("c_deaths")) + '</th><th scope="col" class="n opt">' + esc(t("c_minutes")) + '</th><th scope="col" class="opt2">' +
        esc(t("c_notes")) + "</th></tr></thead><tbody>" + (o.results || []).map(function (r) {
          var g = String(r.grade || "-").charAt(0).toUpperCase();
          var notes = [r.note].concat(r.highlights || []).filter(Boolean).slice(0, 2).map(esc).join("<br>");
          return '<tr><td class="who">' + (r.member ? pilotLink(r.callsign) : esc(r.callsign)) + '</td><td class="opt">' + esc(r.squadron || "–") + '</td><td><span class="grade ' + esc(g) + '">' + esc(r.grade || "–") +
            '</span></td><td class="n">' + fmt(r.score, 1) + '</td><td class="n">' + fmt(r.air_kills) + '</td><td class="n">' + fmt(r.ground_kills) + '</td><td class="n opt">' + fmt(r.friendly_kills) +
            '</td><td class="n opt">' + fmt(r.deaths) + '</td><td class="n opt">' + fmt(r.minutes) + '</td><td class="opt2 note">' + (notes || "–") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    return html + "</div></section>";
  }
  function pilotLink(name) {
    return pilotBySlug(slug(name)) ? '<a href="#pilot-' + slug(name) + '">' + esc(name) + "</a>" : esc(name);
  }

  /* ------------------------------------------------------ pilot profile */
  function pagePilot(s) {
    var p = pilotBySlug(s);
    var back = '<a class="back" href="#pilots">' + esc(t("back_pilots")) + "</a>";
    if (!p) return '<section class="band"><div class="wrap">' + back + '<p class="empty">' + esc(t("not_found")) + "</p></div></section>";
    var r = p.rank || {};
    var place = boardList().indexOf(p) + 1;
    var plate = '<div class="nameplate"><span class="cs">' + esc(p.callsign) + '</span><span class="rankline">' + (r.ar ? '<span class="ar" lang="ar">' + esc(r.ar) + "</span>" : "") +
      (r.en && r.en !== r.ar ? "<span>" + esc(r.en) + "</span>" : "") + (r.insignia ? '<span class="ins">' + esc(r.insignia) + "</span>" : "") + "</span></div>";
    var meta = '<ul class="facts">' + [["c_squadron", p.squadron], ["flies", (p.aircraft || []).join(" · ")], ["joined", p.joined], ["last_flown", p.last_flown],
      ["board_place", place ? "#" + place + " / " + ((DATA && DATA.pilots) || []).length : ""]].filter(function (x) { return x[1]; }).map(function (x) {
        return "<li><span>" + esc(t(x[0])) + "</span><span>" + esc(x[1]) + "</span></li>";
      }).join("") + "</ul>";
    var stats = '<div class="stats">' + [["missions", "s_missions", 0], ["score", "s_score", 1], ["average", "s_avg", 1], ["best", "s_best", 1], ["hours", "s_hours", 1], ["air_kills", "s_air", 0],
      ["ground_kills", "s_ground", 0], ["friendly_kills", "s_ff", 0], ["deaths", "s_deaths", 0], ["qualifications", "s_quals", 0]]
      .map(function (x) { return "<div><b>" + fmt(p[x[0]], x[2]) + "</b><span>" + esc(t(x[1])) + "</span></div>"; }).join("") + "</div>";
    var gr = p.grades || {}, gt = 0;
    "ABCDF".split("").forEach(function (g) { gt += gr[g] || 0; });
    var grades = gt ? '<div class="gradebar">' + "ABCDF".split("").filter(function (g) { return gr[g]; }).map(function (g) {
      return '<i class="g' + g + '" style="flex:' + gr[g] + '" title="' + g + ": " + gr[g] + '">' + g + " " + gr[g] + "</i>";
    }).join("") + "</div>" : '<p class="muted">' + esc(t("no_history")) + "</p>";
    var kinds = Object.keys(p.mission_types || {});
    var kindHtml = kinds.length ? '<div class="kinds">' + kinds.map(function (k) { return '<span class="tag">' + esc(k) + " × " + p.mission_types[k] + "</span>"; }).join("") + "</div>" : "";
    var quals = (p.skills || []).filter(function (k) { return k.qualified; });
    var qualHtml = quals.length ? '<div class="kinds">' + quals.map(function (k) { return '<span class="q big">' + esc(k.name) + "</span>"; }).join("") + "</div>" : '<p class="muted">' + esc(t("no_quals")) + "</p>";
    var courses = (p.courses || []).length ? '<ul class="courses">' + p.courses.map(function (c) {
      return '<li><span>' + esc(c.title) + ((c.instructors || []).length ? '<small class="muted"> · ' + esc(t("instructor_word")) + " " + c.instructors.map(pilotLink).join(", ") + "</small>" : "") + '</span><span class="cst ' + esc(c.status) + '">' + esc(t("cs_" + c.status) || c.status) + "</span></li>";
    }).join("") + "</ul>" : "";
    var skills = (p.skills || []).length ? '<div class="skills">' + p.skills.map(function (k) {
      var pct = k.score == null ? 0 : Math.max(0, Math.min(100, (Number(k.score) / (k.max || 5)) * 100));
      return '<div class="skill"><span class="nm">' + esc(k.name) + (k.qualified ? '<span class="q">' + esc(t("qualified")) + "</span>" : "") + '</span><span class="sc">' +
        (k.score == null ? "–" : fmt(k.score, 1) + " / " + fmt(k.max)) + '</span><span class="meter"><i style="width:' + pct.toFixed(0) + '%"></i></span></div>';
    }).join("") + "</div>" : '<p class="empty">' + esc(t("no_skills")) + "</p>";
    var hist = (p.history || []).length ? '<div class="table-wrap"><table class="res"><thead><tr><th scope="col">' + esc(t("c_date")) + '</th><th scope="col">' + esc(t("c_mission")) + '</th><th scope="col" class="opt">' +
      esc(t("c_type")) + '</th><th scope="col">' + esc(t("c_grade")) + '</th><th scope="col" class="n">' + esc(t("c_score")) + '</th><th scope="col" class="n">' + esc(t("c_air")) +
      '</th><th scope="col" class="n">' + esc(t("c_ground")) + '</th><th scope="col" class="n opt">' + esc(t("c_minutes")) + "</th></tr></thead><tbody>" + p.history.map(function (h) {
        var g = String(h.grade || "-").charAt(0).toUpperCase();
        return '<tr><td class="mono">' + esc(h.date) + '</td><td class="who"><a href="#op-' + esc(h.op) + '">' + esc(h.name) + "</a>" + (h.highlight ? '<span class="rk">' + esc(h.highlight) + "</span>" : "") +
          '</td><td class="opt">' + typeTags(h) + '</td><td><span class="grade ' + esc(g) + '">' + esc(h.grade || "–") + '</span></td><td class="n">' + fmt(h.score, 1) + '</td><td class="n">' + fmt(h.air_kills) +
          '</td><td class="n">' + fmt(h.ground_kills) + '</td><td class="n opt">' + fmt(h.minutes) + "</td></tr>";
      }).join("") + "</tbody></table></div>" : '<p class="empty">' + esc(t("no_history")) + "</p>";
    var pp = (p.patches || []).length ? '<h2 class="h-sm">' + esc(t("patches_h")) + "</h2>" + patchGrid(p.patches, true) : "";
    return '<section class="band tight"><div class="wrap">' + back + '<div class="profile-head"><div class="ph-row">' + photoBlock(p) + plate + "</div>" + meta + "</div>" + stats + pp +
      '<div class="two"><div><h2 class="h-sm">' + esc(t("grades_h")) + "</h2>" + grades + '<h2 class="h-sm">' + esc(t("flown_h")) + "</h2>" + (kindHtml || '<p class="muted">–</p>') +
      '<h2 class="h-sm">' + esc(t("quals_h")) + "</h2>" + qualHtml + (courses ? '<h2 class="h-sm">' + esc(t("courses_h")) + "</h2>" + courses : "") +
      '<h2 class="h-sm">' + esc(t("skills")) + "</h2>" + skills + '</div><div><h2 class="h-sm">' + esc(t("history")) + "</h2>" + hist + "</div></div></div></section>";
  }

  function pageJoin() {
    var reqs = '<ul class="reqs">' + REQS[LANG].map(function (r) { return '<li class="' + r[0] + '"><b>' + esc(r[1]) + "</b><span>" + esc(r[2]) + "</span></li>"; }).join("") + "</ul>";
    var steps = '<ol class="steps">' + ["step1", "step2", "step3", "step4"].map(function (s) { return "<li><span>" + esc(t(s)) + "</span></li>"; }).join("") + "</ol>";
    return '<section class="hero">' + img("takeoff-dusk", "Takeoff at dusk", true).replace("<img ", '<img class="bg" ') + '<div class="wrap"><span class="eyebrow">' + esc(t("join_eyebrow")) +
      "</span><h1>" + esc(t("join_h")) + '</h1><p class="lede">' + esc(t("join_intro")) + '</p><div class="cta-row">' + discordBtn() + "</div></div></section>" +
      '<section class="band"><div class="wrap"><h2>' + esc(t("req_h")) + "</h2>" + reqs + "</div></section>" +
      '<section class="band"><div class="wrap split"><div><h2>' + esc(t("steps_h")) + "</h2>" + steps + '</div><div class="discord-panel"><h3>' + esc(t("discord_h")) + "</h3><p>" +
      esc(t("discord_p")) + "</p>" + discordBtn() + '<span class="url">dsc.gg/veaf</span></div></div><div class="wrap"><p class="privacy">' + esc(t("privacy")) + "</p></div></section>";
  }

  /* ------------------------------------------------- sign-in (the app) */
  var ME = null, POLL = null, BUSY = "";
  function api() { return DATA && DATA.app && DATA.app.api ? String(DATA.app.api).replace(/\/+$/, "") : ""; }
  function joinUrl() { return (DATA && DATA.join_url) || DISCORD; }
  function token() { try { return localStorage.getItem("veaf-token") || ""; } catch (e) { return ""; } }
  function setToken(v) { try { if (v) localStorage.setItem("veaf-token", v); else localStorage.removeItem("veaf-token"); } catch (e) { /* private window */ } }
  function call(path, opts) {
    opts = opts || {};
    var h = opts.headers || {};
    h.Authorization = "Bearer " + token();
    opts.headers = h;
    return fetch(api() + path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 && path !== "/logout") { setToken(""); ME = null; drawUser(); }
        if (!r.ok) throw new Error(j.error || ("HTTP " + r.status));
        return j;
      });
    });
  }
  function isMember() { return !!(ME && ME.member); }
  function myPilot() {
    if (!isMember()) return null;
    var ps = (DATA && DATA.pilots) || [];
    for (var i = 0; i < ps.length; i++) if (ps[i].id === ME.member.member_id) return ps[i];
    return null;
  }
  function photoUrl(p) {
    if (ME && ME.member && p && p.id === ME.member.member_id && ME.photo) return api() + ME.photo;
    return p && p.photo ? p.photo : "";
  }
  function avatar(p, cls) {
    var u = photoUrl(p);
    return u ? '<img class="' + (cls || "badge") + ' ph" src="' + esc(u) + '" alt="" loading="lazy">' : '<span class="' + (cls || "badge") + '" aria-hidden="true">' + initials(p && p.callsign) + "</span>";
  }
  function signIn() {
    try { sessionStorage.setItem("veaf-return", location.hash || "#home"); } catch (e) { /* ignore */ }
    location.href = api() + "/auth/login?return=" + encodeURIComponent(location.origin + location.pathname);
  }
  function loadMe() {
    if (!api() || !token()) { ME = null; drawUser(); return Promise.resolve(null); }
    return call("/me").then(function (j) { ME = j; drawUser(); refreshAppBits(); schedulePoll(); return j; })
      .catch(function () { drawUser(); return null; });
  }
  function pending() { return ((ME && ME.actions) || []).filter(function (a) { return a.status === "pending"; }); }
  function schedulePoll() {
    if (POLL) { clearTimeout(POLL); POLL = null; }
    if (pending().length) POLL = setTimeout(loadMe, 15000);
  }
  function drawUser() {
    var slot = document.getElementById("user-slot");
    if (!slot) return;
    if (!api()) { slot.innerHTML = ""; return; }
    if (!ME) { slot.innerHTML = '<button class="signin" type="button" data-app="signin">' + esc(t("sign_in")) + "</button>"; return; }
    var p = myPilot();
    var face = p ? avatar(p, "uav") : (ME.avatar ? '<img class="uav ph" src="' + esc(ME.avatar) + '" alt="">' : '<span class="uav">' + initials(ME.username) + "</span>");
    slot.innerHTML = '<span class="user">' + (p ? '<a href="#pilot-' + slug(p.callsign) + '" title="' + esc(t("my_profile")) + '">' + face + "<b>" + esc(p.callsign) + "</b></a>" :
      face + "<b>" + esc(ME.username) + "</b>") + '<button type="button" class="out" data-app="signout">' + esc(t("sign_out")) + "</button></span>";
  }
  function nonMemberBand() {
    if (!ME || isMember()) return "";
    return '<section class="band nmband"><div class="wrap"><div class="nm-box"><div><h2>' + esc(t("nm_h")) + "</h2><p>" + esc(t("nm_p").replace("{u}", ME.username || "")) +
      '</p></div><div class="cta-row">' + discordBtn() + "</div></div></div></section>";
  }
  function opStatus(o) {
    var p = myPilot(), cs = p ? p.callsign : (ME && ME.member ? ME.member.callsign : "");
    if ((o.signed || []).indexOf(cs) >= 0) return "in";
    if ((o.reserves || []).indexOf(cs) >= 0) return "res";
    return "out";
  }
  function signupBox(o) {
    if (!api() || !o.op_id) return "";
    var body;
    if (!ME) body = "<p>" + esc(t("su_signin")) + '</p><button class="btn primary" type="button" data-app="signin">' + esc(t("sign_in_discord")) + "</button>";
    else if (!isMember()) body = "<p>" + esc(t("nm_p").replace("{u}", ME.username || "")) + "</p>" + discordBtn();
    else if (!o.open) body = '<p class="muted">' + esc(t("su_closed")) + "</p>";
    else {
      var acts = (ME.actions || []).filter(function (a) { return a.payload && a.payload.op_id === o.op_id && a.kind !== "photo"; });
      var wait = acts.filter(function (a) { return a.status === "pending"; }).length > 0;
      var st = opStatus(o);
      var btns = st === "out" ? [["signup", "primary"], ["reserve", ""]] : st === "res" ? [["signup", "primary"], ["withdraw", ""]] : [["reserve", ""], ["withdraw", ""]];
      body = "<p><b>" + esc(t("su_" + st)) + "</b></p>" + (wait ? '<p class="muted">' + esc(t("su_pending")) + "</p>" :
        '<div class="cta-row">' + btns.map(function (b) {
          return '<button class="btn ' + b[1] + '" type="button" data-app="' + b[0] + '" data-op="' + esc(o.op_id) + '"' + (BUSY ? " disabled" : "") + ">" + esc(t("do_" + b[0])) + "</button>";
        }).join("") + "</div>") + (acts.length && acts[0].result && !wait ? '<p class="muted">' + esc(t("su_last")) + esc(acts[0].result) + "</p>" : "");
    }
    return '<div class="su-box" id="su-box"><h2 class="h-sm">' + esc(t("su_h")) + "</h2>" + body + "</div>";
  }
  function refreshAppBits() {
    var h = (location.hash || "").replace(/^#/, "");
    var box = document.getElementById("su-box");
    if (box && h.indexOf("op-") === 0) { var o = opBySlug(h.slice(3)); if (o) box.outerHTML = signupBox(o); }
    var nm = document.getElementById("nm-slot");
    if (nm) nm.innerHTML = nonMemberBand();
    var ph = document.getElementById("photo-slot");
    if (ph && h.indexOf("pilot-") === 0) { var p = pilotBySlug(h.slice(6)); if (p) ph.outerHTML = photoBlock(p); }
  }
  function photoBlock(p) {
    var mine = isMember() && p.id === ME.member.member_id;
    return '<div class="photo-slot" id="photo-slot">' + avatar(p, "portrait") + (mine ? '<label class="btn small' + (BUSY ? " busy" : "") + '">' +
      esc(BUSY === "photo" ? t("photo_busy") : (photoUrl(p) ? t("photo_change") : t("photo_add"))) +
      '<input type="file" accept="image/*" id="photo-input" hidden></label>' : "") + "</div>";
  }
  function shrink(file) {
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var s = Math.min(im.width, im.height), c = document.createElement("canvas");
        c.width = c.height = 400;
        c.getContext("2d").drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 400, 400);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? ok(b) : bad(new Error("encode")); }, "image/jpeg", 0.85);
      };
      im.onerror = function () { URL.revokeObjectURL(url); bad(new Error(t("photo_bad"))); };
      im.src = url;
    });
  }
  function uploadPhoto(file) {
    BUSY = "photo"; refreshAppBits();
    shrink(file).then(function (blob) {
      return call("/photo", { method: "POST", headers: { "Content-Type": "image/jpeg" }, body: blob });
    }).then(function (j) {
      ME.photo = j.photo; BUSY = ""; drawUser(); refreshAppBits(); toast(t("photo_done"));
      return loadMe();
    }).catch(function (e) { BUSY = ""; refreshAppBits(); toast(t("su_failed") + e.message); });
  }
  function act(kind, opId) {
    BUSY = kind; refreshAppBits();
    call("/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: kind, op_id: opId }) })
      .then(function () { BUSY = ""; return loadMe(); })
      .catch(function (e) { BUSY = ""; refreshAppBits(); toast(t("su_failed") + e.message); });
  }
  function toast(msg) {
    var el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 5000);
  }
  function patchGrid(list, withOp) {
    if (!(list || []).length) return '<p class="muted">' + esc(t("no_patches")) + "</p>";
    return '<div class="patches">' + list.map(function (x) {
      var inner = '<img src="' + esc(x.image) + '" alt="" loading="lazy" width="96" height="96"><span class="nm">' + esc(x.name) + "</span>" +
        (x.holders ? '<span class="sub">' + fmt(x.holders.length) + " " + esc(t("holders")) + "</span>" : x.date ? '<span class="sub mono">' + esc(x.date) + "</span>" : "");
      return withOp && x.op ? '<a class="patch" href="#op-' + esc(x.op) + '" title="' + esc(x.description || x.name) + '">' + inner + "</a>" :
        '<div class="patch" title="' + esc(x.description || x.name) + '">' + inner + "</div>";
    }).join("") + "</div>";
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-app]") : null;
    if (!el || el.disabled) return;
    var k = el.getAttribute("data-app");
    if (k === "signin") signIn();
    else if (k === "signout") {
      call("/logout", { method: "POST" }).catch(function () { /* already gone */ });
      setToken(""); ME = null; drawUser(); route();
    } else act(k, el.getAttribute("data-op"));
  });
  document.addEventListener("change", function (e) {
    if (e.target.id === "photo-input" && e.target.files && e.target.files[0]) uploadPhoto(e.target.files[0]);
  });
  (function takeToken() {
    var m = /^#auth-([A-Za-z0-9_-]+)/.exec(location.hash || "");
    if (!m) return;
    setToken(m[1]);
    var back = "#home";
    try { back = sessionStorage.getItem("veaf-return") || "#home"; sessionStorage.removeItem("veaf-return"); } catch (err) { /* ignore */ }
    history.replaceState(null, "", location.pathname + location.search + back);
  })();

  /* -------------------------------------------------------------- router */
  var ROUTES = { home: pageHome, about: pageAbout, training: pageTraining, pvp: pagePvp, airshow: pageAirshow, pilots: pagePilots, leaderboard: pageBoard, operations: pageOps, join: pageJoin };
  function route() {
    var h = (location.hash || "").replace(/^#/, "") || "home";
    var main = document.getElementById("main");
    var html;
    if (h.indexOf("pilot-") === 0) html = pagePilot(h.slice(6));
    else if (h.indexOf("op-") === 0) html = pageOp(h.slice(3));
    else html = (ROUTES[h] || pageHome)();
    main.innerHTML = '<div id="nm-slot">' + nonMemberBand() + "</div>" + html;
    var cur = h.indexOf("pilot-") === 0 ? "pilots" : h.indexOf("op-") === 0 ? "operations" : (ROUTES[h] ? h : "home");
    Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
      if (a.getAttribute("href") === "#" + cur) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    document.getElementById("nav").classList.remove("open");
    document.getElementById("menu-btn").setAttribute("aria-expanded", "false");
    drawRoster(); drawBoard(); drawOps();
    window.scrollTo(0, 0);
  }

  function applyLang() {
    var root = document.documentElement;
    root.lang = LANG; root.dir = LANG === "ar" ? "rtl" : "ltr";
    Array.prototype.forEach.call(document.querySelectorAll("[data-i]"), function (el) { el.textContent = t(el.getAttribute("data-i")); });
    document.getElementById("lang").textContent = t("lang_other");
    stamp();
    if (typeof drawUser === "function") drawUser();
  }
  function stamp() {
    var s = document.getElementById("stamp");
    if (s && DATA && DATA.generated) s.textContent = t("updated") + ": " + String(DATA.generated).replace("T", " ").replace("+00:00", " UTC");
  }

  /* -------------------------------------------------------------- events */
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-ac],[data-sq],[data-bsq],[data-otype],[data-sort],#lang,#menu-btn,img[data-full],.lightbox") : null;
    if (!el) return;
    if (el.classList.contains("lightbox")) { el.remove(); return; }
    if (el.id === "lang") {
      LANG = LANG === "ar" ? "en" : "ar";
      try { localStorage.setItem("veaf-lang", LANG); } catch (err) { /* private window */ }
      applyLang(); route(); return;
    }
    if (el.id === "menu-btn") {
      var nav = document.getElementById("nav"); var open = nav.classList.toggle("open");
      el.setAttribute("aria-expanded", String(open)); return;
    }
    if (el.hasAttribute("data-ac")) {
      rosterFilter.ac = el.getAttribute("data-ac");
      Array.prototype.forEach.call(document.querySelectorAll("[data-ac]"), function (c) { c.setAttribute("aria-pressed", String(c === el)); });
      drawRoster(); return;
    }
    if (el.hasAttribute("data-sq")) {
      rosterFilter.sq = el.getAttribute("data-sq");
      Array.prototype.forEach.call(document.querySelectorAll("[data-sq]"), function (c) { c.setAttribute("aria-pressed", String(c === el)); });
      drawRoster(); return;
    }
    if (el.hasAttribute("data-sort")) { boardSort = el.getAttribute("data-sort"); drawBoard(); return; }
    if (el.hasAttribute("data-bsq")) {
      var v = el.getAttribute("data-bsq");
      boardSq = boardSq === v && v !== "*" ? "*" : v;
      Array.prototype.forEach.call(document.querySelectorAll("[data-bsq]"), function (c) {
        var cv = c.getAttribute("data-bsq");
        if (c.classList.contains("chip")) c.setAttribute("aria-pressed", String(cv === boardSq)); else c.classList.toggle("on", cv === boardSq);
      });
      drawBoard(); return;
    }
    if (el.hasAttribute("data-otype")) {
      opFilter.type = el.getAttribute("data-otype");
      Array.prototype.forEach.call(document.querySelectorAll("[data-otype]"), function (c) { c.setAttribute("aria-pressed", String(c === el)); });
      drawOps(); return;
    }
    if (el.tagName === "IMG" && el.closest(".gallery, .feature")) {
      var lb = document.createElement("div"); lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-label", el.alt);
      lb.innerHTML = '<img src="' + el.getAttribute("data-full") + '" alt="' + esc(el.alt) + '">';
      document.body.appendChild(lb);
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { var lb = document.querySelector(".lightbox"); if (lb) lb.remove(); } });
  document.addEventListener("input", function (e) { if (e.target.id === "pilot-search") { rosterFilter.q = e.target.value; drawRoster(); }
    if (e.target.id === "op-search") { opFilter.q = e.target.value; drawOps(); } });
  window.addEventListener("hashchange", route);

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(function () { /* the site works without it */ });
  }
  applyLang();
  document.getElementById("main").innerHTML = '<section class="band"><div class="wrap"><p class="empty">' + esc(t("loading")) + "</p></div></section>";
  fetch("data.json", { cache: "no-cache" }).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(function (d) { DATA = d; stamp(); route(); drawUser(); loadMe(); }).catch(function () {
    DATA = { pilots: [], scrims: [], totals: {} };
    route();
    var m = document.getElementById("main");
    m.insertAdjacentHTML("afterbegin", '<div class="wrap" style="padding-block:16px"><p class="empty">' + esc(t("load_failed")) + "</p></div>");
  });
})();
