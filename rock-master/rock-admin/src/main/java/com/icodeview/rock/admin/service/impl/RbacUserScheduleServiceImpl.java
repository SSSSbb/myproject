package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacUserScheduleDto;
import com.icodeview.rock.admin.ga.MyGa;
import com.icodeview.rock.admin.mapper.RbacUserScheduleMapper;
import com.icodeview.rock.admin.pojo.RbacUser;
import com.icodeview.rock.admin.pojo.RbacUserPreferences;
import com.icodeview.rock.admin.pojo.RbacUserSchedule;
import com.icodeview.rock.admin.service.RbacUserPreferencesService;
import com.icodeview.rock.admin.service.RbacUserScheduleService;
import com.icodeview.rock.admin.service.RbacUserService;
import com.icodeview.rock.admin.vo.RbacUserPreferencesVo;
import com.icodeview.rock.admin.vo.RbacUserScheduleVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RbacUserScheduleServiceImpl extends ServiceImpl<RbacUserScheduleMapper, RbacUserSchedule> implements RbacUserScheduleService {
    @Resource
    private RbacUserService userService;
    @Resource
    private RbacUserPreferencesService preferencesService;

    @Override
    public List<RbacUserScheduleDto> getScheduleDTO() {
        Date date = new Date();
        List<RbacUserSchedule> schedules = this.query()
                .between("create_time", getThisWeekMonday(date), getThisWeekSunday(date))
                .list();

        return schedules.stream().map(s -> {
            RbacUserScheduleDto scheduleDTO = new RbacUserScheduleDto();
            BeanUtils.copyProperties(s, scheduleDTO);
            RbacUser user = userService.getById(s.getUserid());
            scheduleDTO.setUser(user);
            return scheduleDTO;
        }).collect(Collectors.toList());
    }
    @Override
    public List<RbacUserScheduleVo> getIndex(Integer id, Integer userid, Integer belongto) {
        List<RbacUserSchedule> scheduleList = lambdaQuery()
                .eq(id != null, RbacUserSchedule::getId, id)
                .eq(userid != null, RbacUserSchedule::getUserid, userid)
                .eq(belongto != null, RbacUserSchedule::getBelongto, belongto)
                .orderByDesc(RbacUserSchedule::getId)
                .list();

        return scheduleList.stream()
                .map(rbacUserSchedule -> BeanUtil.copyProperties(rbacUserSchedule, RbacUserScheduleVo.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateSchedule(RbacUserScheduleDto dto){
        RbacUserSchedule schedule = BeanUtil.copyProperties(dto,RbacUserSchedule.class);
        schedule.setId(dto.getId());
        schedule.setUserid(dto.getUserid());
        updateById(schedule);
    }
    @Override
    public void generate(Integer belongto) {
        List<RbacUserPreferences> userList = preferencesService.list();
        LocalDateTime createTimeValue = LocalDateTime.now();
        System.out.println(userList);
        ArrayList<Long> userIds = new ArrayList<>();
        // 获取员工偏好
        HashMap<Long, Integer> noMoreThanTime = new HashMap<>();
        Map<Long, Integer> noWeekDay = new HashMap<>();
        for (RbacUserPreferences user : userList) {
            Integer userId = Math.toIntExact(user.getUserid());
            RbacUserPreferences preferences = preferencesService.query().eq("userid", userId).one();
            noMoreThanTime.put(Long.valueOf(userId), preferences.getNoMoreThanTime());
            noWeekDay.put(Long.valueOf(userId), preferences.getNoWorkDay());
            userIds.add(Long.valueOf(userId));
        }

        // 调用GA生成
        MyGa myGa = new MyGa();

        // 调用ga
        List<List<Long>> plan = myGa.doPlan(userIds, noMoreThanTime, noWeekDay);

        ArrayList<RbacUserSchedule> schedules = new ArrayList<>();
        // 入库
        for (int i = 0; i < plan.size(); i++) {
            List<Long> pl = plan.get(i);
            for (int j = 0; j < pl.size(); j++) {
                schedules.add(new RbacUserSchedule(pl.get(j), i, j,belongto,createTimeValue));
            }
        }
        System.out.println(schedules);
        List<RbacUserScheduleDto> dtoList = this.getScheduleDTO();
        if (dtoList != null) {
            this.removeBatchByIds(dtoList);
        }
        this.saveBatch(schedules);
    }


    public static Date getThisWeekMonday(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        // 获得当前日期是一个星期的第几天
        int dayWeek = cal.get(Calendar.DAY_OF_WEEK);
        if (1 == dayWeek) {
            cal.add(Calendar.DAY_OF_MONTH, -1);
        }
        // 设置一个星期的第一天，按中国的习惯一个星期的第一天是星期一
        cal.setFirstDayOfWeek(Calendar.MONDAY);
        // 获得当前日期是一个星期的第几天
        int day = cal.get(Calendar.DAY_OF_WEEK);
        // 根据日历的规则，给当前日期减去星期几与一个星期第一天的差值
        cal.add(Calendar.DATE, cal.getFirstDayOfWeek() - day - 1);
        return cal.getTime();
    }
    public static Date getThisWeekSunday(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(getThisWeekMonday(date));
        cal.add(Calendar.DATE, 7);
        return cal.getTime();
    }
}
