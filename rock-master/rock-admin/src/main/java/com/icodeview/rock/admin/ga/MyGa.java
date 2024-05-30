package com.icodeview.rock.admin.ga;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 遗传算法排课
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class MyGa {

    //种群的规模（0-100）
    private Integer popSize = 32;
    //种群的变异概率
    private Double mutProb = 0.5;
    // 交叉概率
    private Double crossoverProb = 0.4;
    // 赌狗
    private Double dogProb = 0.3;
    //精英种群的个数
    private Integer elite = 15;
    //进化代数（100-500）
    private Integer maxIter = 500;

    // 单种群
//    private List<List<Long>> population;

    // 种群集
    private List<Population> species = new ArrayList<>();

    // 员工集
    private List<Long> userList;
    // 不超过工时
    private Map<Long, Integer> noMoreThanTime;
    // 周几不上班
    private Map<Long, Integer> noWeekDay;


    /**
     * 演化
     */
    public void evolute() {
        for (int i = 0; i < popSize; i++) {
            init();
        }


        for (int i = 0; i < maxIter; i++) {
            //交叉
            crossover();

            //变异
            mutate();

            // 轮盘赌命遗传
            select();

        }
    }

    public void crossover() {
        for (Population pop : species) {
            if (Math.random() < crossoverProb) {
                Random random = new Random(System.currentTimeMillis());
                int row1 = random.nextInt(5);
                int column1 = random.nextInt(7);
                int row2 = random.nextInt(5);
                int column2 = random.nextInt(7);

                Long cell1 = pop.getPop().get(row1).get(column1);
                Long cell2 = pop.getPop().get(row2).get(column2);
                pop.getPop().get(row1).set(column1, cell2);
                pop.getPop().get(row2).set(column2, cell1);
            }
        }

    }

    public void mutate() {
        for (Population pop : species) {
            if (Math.random() < mutProb) {
                Random random = new Random(System.currentTimeMillis());
                int n = this.userList.size();
                int userIdx = random.nextInt(n);
                int row = random.nextInt(5);
                int column = random.nextInt(7);
                pop.getPop().get(row).set(column, this.userList.get(userIdx));
            }
        }
    }

    public void select() {
        cale();
    }

    public void cale() {
        HashMap<Population, Integer> scores = new HashMap<>();

        caleInit(scores);

        for (Population pop : species) {
            // 周总工时
            checkWorkTime(pop, scores);
            // 周几不工作
            checkWeekDay(pop, scores);
        }


        ArrayList<Map.Entry<Population, Integer>> entries = new ArrayList<>(scores.entrySet());
        entries.sort((o1, o2) -> o2.getValue().compareTo(o1.getValue()));

        List<Population> newSpecies = new ArrayList<>();
        // 选前1/4个为精英种群
        int talentNum = popSize / 4;
        for (int i = 0; i < talentNum; i++) {
            Population pop = entries.get(i).getKey();
            newSpecies.add(pop);
        }

        // 轮盘赌狗
        int n = entries.size();
        int i1 = n - talentNum;
        Random random = new Random(System.currentTimeMillis());
        for (int i = talentNum; i < popSize; i++) {
            int idx;
            if (Math.random() < dogProb) {
                idx = random.nextInt(i1) + talentNum - 1;
            } else {
                idx = random.nextInt(talentNum);
            }
            Population p = entries.get(idx).getKey();
            newSpecies.add(new Population(p.getPop()));
        }

        species = newSpecies;
    }

    /**
     * 初始化计算适应度
     *
     * @param scores 分数
     */
    private void caleInit(Map<Population, Integer> scores) {
        for (Population pop : species) {
            scores.put(pop, 0);
        }
    }

    /**
     * 计算员工的一周总工时
     *
     * @param pop 群体
     * @return 群体的总工时
     */
    public Map<Long, Integer> caleWorkTime(Population pop) {
        HashMap<Long, Integer> res = new HashMap<>();

        for (List<Long> ps : pop.getPop()) {
            for (Long p : ps) {
                if (res.containsKey(p)) {
                    res.put(p, res.get(p) + 3);
                } else {
                    res.put(p, 3);
                }
            }
        }
        return res;
    }

    /**
     * 判断工时
     *
     * @param pop   群体
     * @param score 群体的分数
     */
    public void checkWorkTime(Population pop, Map<Population, Integer> score) {
        Map<Long, Integer> map = this.caleWorkTime(pop); // 总工时

        AtomicReference<Integer> sc = new AtomicReference<>(score.get(pop));
        map.forEach((k, v) -> {
            Integer noMoreTime = this.noMoreThanTime.get(k);
            int last = Math.max(noMoreTime - 5, 3);
            // 不超过工时
            if (last <= v && v <= noMoreTime + 3) {
                sc.getAndSet(sc.get() + 10);
            } else {
                int sub = Math.abs(v - noMoreTime);
                sc.getAndSet(sc.get() - 2 * sub);
            }
            // 没安排到的
            if (v == 0) {
                sc.getAndSet(sc.get() - 5);
            }


        });
        score.put(pop, sc.get());
    }

    /**
     * 根据在周几不上班加工算分
     *
     * @param pop   群体
     * @param score 群体的分数
     */
    public void checkWeekDay(Population pop, Map<Population, Integer> score) {
        Integer originSc = score.get(pop);
        for (Long userId : this.userList) {
            Integer noWeekDay = this.noWeekDay.get(userId);
            for (int i = 0; i < 5; i++) {
                if (!pop.getPop().get(i).get(noWeekDay - 1).equals(userId)) {
                    originSc += 8;
                }
            }
        }
        score.put(pop, originSc);
    }


    public void init() {
        Population pop = new Population();
        int n = userList.size();
        Random random = new Random(System.currentTimeMillis());
        pop.setPop(new ArrayList<>());
        for (int i = 0; i < 5; i++) {
            ArrayList<Long> p = new ArrayList<>();
            for (int j = 0; j < 7; j++) {
                p.add(userList.get(random.nextInt(n)));
            }
            pop.getPop().add(p);
        }
        species.add(pop);
    }

    public List<List<Long>> doPlan(List<Long> userList, Map<Long, Integer> noMoreThanTime, Map<Long, Integer> noWeekDay) {
        this.userList = userList;
        this.noMoreThanTime = noMoreThanTime;
        this.noWeekDay = noWeekDay;

        evolute();
        return species.get(0).getPop();
    }

    public static void main(String[] args) {
        MyGa myGa = new MyGa();
        ArrayList<Long> userIds = new ArrayList<>(Arrays.asList(1L, 2L, 4L, 5L, 6L, 7L, 9L));

        HashMap<Long, Integer> noMoreThanTime = new HashMap<>();
        HashMap<Long, Integer> noWeekDay = new HashMap<>();
        Random random = new Random(System.currentTimeMillis());
        for (Long userId : userIds) {
            noMoreThanTime.put(userId, random.nextInt(25) + 10);
            noWeekDay.put(userId, random.nextInt(7) + 1);
        }
        log.debug(String.valueOf(noMoreThanTime));
        log.debug(String.valueOf(noWeekDay));

        List<List<Long>> population = myGa.doPlan(userIds, noMoreThanTime, noWeekDay);
        for (List<Long> ps : population) {
            System.out.println(ps);
        }
    }
}